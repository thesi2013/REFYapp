import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import * as jsfeat from 'jsfeat';
import { Box } from 'src/app/models/Box';
import { Options } from 'src/app/models/Options';

@Component({
  selector: 'app-label-scanner',
  templateUrl: './label-scanner.component.html',
  styleUrls: ['./label-scanner.component.scss']
})
export class LabelScannerComponent implements OnInit, AfterViewInit {

  constructor() {
    this.getScreenSize();
  }

  // State
  imageChosen = false;
  @Input() box = new Box();
  @Output() labelScanned = new EventEmitter<Box>();

  // Webcam
  trigger = new Subject<void>();
  triggerObservable = this.trigger.asObservable();
  cameraId = new Subject<string>();
  cameraIdObservable: Observable<string> = this.cameraId.asObservable();
  isCameraSwitched = false;
  constraints = {
    width: { exact: 720 },
    aspectRatio: { exact: 1 },
    facingMode: 'environment'
  };
  webcamSize: number;

  // Canvas Variables
  @ViewChild('canvas') private canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Compute Variables
  readonly computeSize = 720;
  private rhoAccuracy = 1;
  // low theta accuracy as we only want horizontal and vertical lines
  private thetaAccuracy = Math.PI / 2;
  private houghThreshold = 100;
  private templateImageData: ImageData;

  private static contrastImage(imgData, contrast) {
    let d = imgData.data;
    contrast = (contrast / 100) + 1;
    let intercept = 128 * (1 - contrast);
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i] * contrast + intercept;
      d[i + 1] = d[i + 1] * contrast + intercept;
      d[i + 2] = d[i + 2] * contrast + intercept;
    }
    return imgData;
  }

  ngOnInit() {

  }

  switchCamera(event) {
    if (!this.isCameraSwitched) {
      this.isCameraSwitched = true;
      navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {
        devices = devices.filter(d => /video/gi.test(d.kind));
        console.log(devices);
        for (let i = 0; i < devices.length; i++) {
          if (/back|rear|environment/gi.test(devices[i].label)) {
            this.cameraId.next(devices[i].deviceId);
            return;
          }
        }
        this.cameraId.next(devices[devices.length - 1].deviceId);
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.webcamSize = Math.min(window.innerHeight, window.innerWidth);
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = this.computeSize;
    this.canvas.height = this.computeSize;
    this.ctx = this.canvas.getContext('2d');

    // load template image data
    const image = new Image();
    image.src = 'assets/images/test-corrected-blurred.jpg';
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, this.computeSize, this.computeSize);
      this.templateImageData = this.ctx.getImageData(0, 0, this.computeSize, this.computeSize);
    };
  }

  takePicture(): void {
    this.trigger.next();
  }

  handlePicture(cameraImage: WebcamImage): void {
    this.imageChosen = true;
    const image = new Image();
    image.src = cameraImage.imageAsDataUrl;
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      // Crops label as per overlay to 1:1
      // TODO select correct section of image
      const imageData = this.ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
      this.compute(imageData);
    };
  }

  /** Just for demo */
  loadPicture(): void {
    this.imageChosen = true;
    const image = new Image();
    image.src = '/assets/images/test-cropped-content.jpg';
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, this.computeSize, this.computeSize);
      this.compute(this.ctx.getImageData(0, 0, this.computeSize, this.computeSize));
    };
  }

  /**
   * Call with cropped 1:1 image from camera
   */
  private compute(imageData: ImageData): void {
    console.log('---- BEGIN ISOLATE LABEL ----');
    imageData = this.isolateLabel(imageData);
    console.log('---- BEGIN GET FEATURES ----');
    this.box = this.getFeatures(imageData, this.box);
    console.log('---- RESULT ---- \n', this.box);
    this.labelScanned.emit(this.box);
  }

  /* tslint:disable:no-bitwise */
  private isolateLabel(imageData: ImageData): ImageData {
    let img_u8 = new jsfeat.matrix_t(this.computeSize, this.computeSize, jsfeat.U8C1_t);
    imageData = LabelScannerComponent.contrastImage(imageData, 300);
    jsfeat.imgproc.grayscale(imageData.data, this.computeSize, this.computeSize, img_u8);

    let square = this.getLabelCorners(img_u8, 100);
    img_u8 = this.performImageCorrection(img_u8, square);

    let data_u32 = new Uint32Array(imageData.data.buffer);
    let alpha = (0xff << 24);
    let i = img_u8.cols * img_u8.rows, pix = 0;
    while (--i >= 0) {
      pix = img_u8.data[i];
      data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }
    this.ctx.putImageData(imageData, 0, 0);


    // Scale image down to fit window
    let imageObject = new Image();
    imageObject.onload = () => {
      this.canvas.width = this.webcamSize;
      this.canvas.height = this.webcamSize;
      this.ctx.drawImage(imageObject, 0, 0, this.webcamSize, this.webcamSize);
    };
    imageObject.src = this.canvas.toDataURL();

    return imageData;
  }
  /* tslint:enable:no-bitwise */

  private getLabelCorners(img_u8, score) {
    let pixels = [];
    for (let i = 0; i < img_u8.cols * img_u8.rows; ++i) {
      pixels[i] = new jsfeat.keypoint_t(0, 0, 0, 0);
    }

    jsfeat.fast_corners.set_threshold(0);
    jsfeat.fast_corners.detect(img_u8, pixels, 5);

    let square = {
      a: {
        x: this.computeSize / 2,
        y: this.computeSize / 2
      },
      b: {
        x: this.computeSize / 2,
        y: this.computeSize / 2
      },
      c: {
        x: this.computeSize / 2,
        y: this.computeSize / 2
      },
      d: {
        x: this.computeSize / 2,
        y: this.computeSize / 2
      },
    };
    let corners = [];
    /**
     * The corners go as follows.
     * A - B
     * |   |
     * C - D
     * We want to find the point with the shortest distance from the point to its image corner.
     */
    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i].score > score) {
        corners.push({ x: pixels[i].x, y: pixels[i].y });

        if (pixels[i].x < 360 && pixels[i].y < 360) {
          pixels[i].color = 'purple';
          if (square.a.x + square.a.y > pixels[i].x + pixels[i].y) {
            square.a.x = pixels[i].x;
            square.a.y = pixels[i].y;
          }
        } else if (pixels[i].x > 360 && pixels[i].y < 360) {
          pixels[i].color = 'green';
          if ((720 - square.b.x) + square.b.y > (720 - pixels[i].x) + pixels[i].y) {
            square.b.x = pixels[i].x;
            square.b.y = pixels[i].y;
          }
        } else if (pixels[i].x < 360 && pixels[i].y > 360) {
          pixels[i].color = 'blue';
          if (square.c.x + (720 - square.c.y) > pixels[i].x + (720 - pixels[i].y)) {
            square.c.x = pixels[i].x;
            square.c.y = pixels[i].y;
          }
        } else if (pixels[i].x > 360 && pixels[i].y > 360) {
          pixels[i].color = 'orange';
          if (square.d.x + square.d.y < pixels[i].x + pixels[i].y) {
            square.d.x = pixels[i].x;
            square.d.y = pixels[i].y;
          }
        }
      }
    }

    for (let i = 0; i < corners.length; i++) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'green';
      this.ctx.rect(corners[i].x - 2, corners[i].y - 2, 4, 4);
      this.ctx.fill();
    }

    for (let corner in square) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'red';
      this.ctx.rect(square[corner].x - 2, square[corner].y - 2, 4, 4);
      this.ctx.fill();
    }
    return square;
  }

  private performImageCorrection(img_u8, square) {
    let transform = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
    let img_u8_warp = new jsfeat.matrix_t(this.computeSize, this.computeSize, jsfeat.U8_t | jsfeat.C1_t);
    jsfeat.math.perspective_4point_transform(transform,
      square.a.x, square.a.y, 0, 0,
      square.b.x, square.b.y, this.computeSize, 0,
      square.c.x, square.c.y, 0, this.computeSize,
      square.d.x, square.d.y, this.computeSize, this.computeSize
    );
    jsfeat.matmath.invert_3x3(transform, transform);
    jsfeat.imgproc.warp_perspective(img_u8, img_u8_warp, transform, 0);
    return img_u8_warp;
  }

  private getFeatures(imageData: ImageData, inputBox: Box): Box {
    const result = inputBox;

    // -------------------------
    // Weather
    {
      const weatherP = new Array<number>();
      const weatherOffsetX = 9;
      const weatherOffsetY = 213;
      const weatherSize = 39;
      // cut correct pieces from source
      for (let i = 0; i < 3; i++) {
        // src image
        this.ctx.putImageData(imageData, 0, 0);
        const sourceBlock = this.ctx.getImageData(weatherOffsetX + (i * (weatherSize + 1)), weatherOffsetY, weatherSize, weatherSize);
        // template image
        this.ctx.putImageData(this.templateImageData, 0, 0);
        const referenceBlock = this.ctx.getImageData(weatherOffsetX + (i * (weatherSize + 1)), weatherOffsetY, weatherSize, weatherSize);

        weatherP[i] = this.getErrorCoefficient(sourceBlock, referenceBlock);
      }
      // normalise values
      const weatherPMin = weatherP.reduce((prev, curr) => prev < curr ? prev : curr);
      weatherP.forEach((val, idx) => weatherP[idx] = val - weatherPMin);
      const weatherPTotal = weatherP.reduce((prev, curr) => prev + curr);
      for (let i = 0; i < weatherP.length; i++) {
        weatherP[i] = weatherP[i] / weatherPTotal;
      }
      // push closest match to result
      console.log('weather', weatherP);
      let resWeatherIndex = 0;
      for (let i = 1; i < weatherP.length; i++) {
        if (weatherP[i] > weatherP[resWeatherIndex]) {
          resWeatherIndex = i;
        }
      }
      result.weather.push(Options.weatherOptions[resWeatherIndex].id);
    }

    // -------------------------
    // Category
    {
      const categoryP = new Array<number>();
      const categoryOffsetX = 8;
      const categoryOffsetY = 291;
      const categorySize = 77;
      // cut correct pieces from source
      for (let i = 0; i < 5; i++) {
        // src image
        this.ctx.putImageData(imageData, 0, 0);
        const sourceBlock = this.ctx.getImageData(
          categoryOffsetX + (i * (categorySize + 1)),
          categoryOffsetY,
          categorySize,
          categorySize
        );
        // template image
        this.ctx.putImageData(this.templateImageData, 0, 0);
        const referenceBlock = this.ctx.getImageData(
          categoryOffsetX + (i * (categorySize + 1)),
          categoryOffsetY,
          categorySize,
          categorySize
        );

        categoryP[i] = this.getErrorCoefficient(sourceBlock, referenceBlock);
      }
      // normalise values
      const categoryPmin = categoryP.reduce((prev, curr) => prev < curr ? prev : curr);
      categoryP.forEach((val, idx) => categoryP[idx] = val - categoryPmin);
      const categoryPTotal = categoryP.reduce((prev, curr) => prev + curr);
      for (let i = 0; i < categoryP.length; i++) {
        categoryP[i] = categoryP[i] / categoryPTotal;
      }
      // push closest match to result
      console.log('category', categoryP);
      let resCategoryIndex = 0;
      for (let i = 1; i < categoryP.length; i++) {
        if (categoryP[i] > categoryP[resCategoryIndex]) {
          resCategoryIndex = i;
        }
      }
      result.categories.push(Options.categoryOptions[resCategoryIndex].id);
    }

    // -------------------------
    // Item
    {
      const itemP = new Array<number>();
      const itemOffsetX = 8;
      const itemOffsetY = 406;
      const itemSize = 76;
      // cut correct pieces from source
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 7; j++) {
          // src image
          this.ctx.putImageData(imageData, 0, 0);
          const sourceBlock = this.ctx.getImageData(
                                itemOffsetX + (j * (itemSize + 1)),
                                itemOffsetY + ( i * (itemSize + 1)),
                                itemSize,
                                itemSize
                              );
          // template image
          this.ctx.putImageData(this.templateImageData, 0, 0);
          const referenceBlock = this.ctx.getImageData(
                                  itemOffsetX + (j * (itemSize + 1)),
                                  itemOffsetY + ( i * (itemSize + 1)),
                                  itemSize,
                                  itemSize
                                );

          itemP[(i * 7) + j] = this.getErrorCoefficient(sourceBlock, referenceBlock);
        }
      }
      // normalise values
      const itemPMin = itemP.reduce((prev, curr) => prev < curr ? prev : curr);
      itemP.forEach((val, idx) => itemP[idx] = val - itemPMin);
      const itemPTotal = itemP.reduce((prev, curr) => prev + curr);
      for (let i = 0; i < itemP.length; i++) {
        itemP[i] = itemP[i] / itemPTotal;
      }
      // push closest match to result
      console.log('item', itemP);
      let resItemIndex = 0;
      for (let i = 1; i < itemP.length; i++) {
        if (itemP[i] > itemP[resItemIndex]) {
          resItemIndex = i;
        }
      }
      result.items.push(Options.itemOptions[resItemIndex].id);
    }

    return result;
  }

  private getErrorCoefficient(source: ImageData, reference: ImageData): number {
    let result = 0;
    // increment by 4 for each pixel, array stores RGBA values seperately
    for (let i = 0; i < source.data.length; i += 4) {
      result += Math.pow(
        Math.abs(reference.data[i] - source.data[i])
        + Math.abs(reference.data[i + 1] - source.data[i + 1])
        + Math.abs(reference.data[i + 2] - source.data[i + 2])
        + Math.abs(reference.data[i + 3] - source.data[i + 3])
        , 2);
    }
    return result;
  }

  // TODO GIVE CORRECT NAME (IS FOR RGBA Matrix to canvas I THINKKKKKK)
  /* tslint:disable:no-bitwise */
  private writeImageToCanvas(imgData: ImageData, compMat: any) {
    const data_u32 = new Uint32Array();
    // const data_u32 = new Uint32Array(imgData.data.buffer);
    const alpha = (0xff << 24);
    let i = compMat.cols * compMat.rows;
    let pix = 0;

    while (--i >= 0) {
      pix = compMat.data[i];
      data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }

    this.ctx.putImageData(imgData, 0, 0);
  }
  /* tslint:enable:no-bitwise */

  private writeHoughLinesOnCanvas(hL: any): void {
    hL.forEach((line) => {
      const d = line[0];
      const angle = line[1];
      console.log({ d: d, angle: angle });

      const x1 = d * Math.cos(angle);
      const y1 = d * Math.sin(angle);

      const x2 = (d * (1 / Math.cos(0.1))) * Math.cos(angle + 0.1);
      const y2 = (d * (1 / Math.cos(0.1))) * Math.sin(angle + 0.1);

      const xDir = x2 - x1;
      const yDir = y2 - y1;

      const xStart = x1 + (-1000 * (x2 - x1));
      const yStart = y1 + (-1000 * (y2 - y1));
      const xEnd = x1 + (1000 * (x2 - x1));
      const yEnd = y1 + (1000 * (y2 - y1));

      this.ctx.strokeStyle = '#FF0000';
      this.ctx.beginPath();
      this.ctx.moveTo(xStart, yStart);
      this.ctx.lineTo(xEnd, yEnd);
      this.ctx.stroke();
    });
  }
}
