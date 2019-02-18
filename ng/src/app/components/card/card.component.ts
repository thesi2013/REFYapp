import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as jsfeat from 'jsfeat';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  time;

  image = new Image();
  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.getBase64FromImageUrl('/assets/images/test-cropped.jpg');
  }

  getBase64FromImageUrl(url: string): void {
    this.time = new Date().getTime();

    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ratio = Math.min(720 / img.width, 720 / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataUrl = canvas.toDataURL('image/png');
      this.handlePicture(dataUrl);
    };
    img.src = url;
  }

  handlePicture(dataUrl: string): void {
    this.image.onload = () => {
      let imgWidth = this.image.width;
      let imgHeight = this.image.height;
      this.ctx.canvas.width = imgWidth;
      this.ctx.canvas.height = imgHeight;
      this.ctx.drawImage(this.image, 0, 0);

      let img_u8 = new jsfeat.matrix_t(imgWidth, imgHeight, jsfeat.U8C1_t);
      let transform = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
      let img_u8_warp = new jsfeat.matrix_t(imgWidth, imgHeight, jsfeat.U8_t | jsfeat.C1_t);
      let imageData = this.ctx.getImageData(0, 0, imgWidth, imgHeight);

      imageData = this.contrastImage(imageData, 300);
      jsfeat.imgproc.grayscale(imageData.data, imgWidth, imgHeight, img_u8);

      let corners = [];
      for (let i = 0; i < img_u8.cols * img_u8.rows; ++i) {
        corners[i] = new jsfeat.keypoint_t(0, 0, 0, 0);
      }

      jsfeat.fast_corners.set_threshold(0);
      jsfeat.fast_corners.detect(img_u8, corners, 5);

      let new_corners = [];
      let square = {
        a: {
          x: imgWidth / 2,
          y: imgHeight / 2
        },
        b: {
          x: imgWidth / 2,
          y: imgHeight / 2
        },
        c: {
          x: imgWidth / 2,
          y: imgHeight / 2
        },
        d: {
          x: imgWidth / 2,
          y: imgHeight / 2
        },
      };
      for (let i = 0; i < corners.length; i++) {
        if (corners[i].score > 30) {

          if (corners[i].x < 360 && corners[i].y < 360) {
            corners[i].color = 'purple';
            if (square.a.x + square.a.y > corners[i].x + corners[i].y) {
              square.a.x = corners[i].x;
              square.a.y = corners[i].y;
            }
          } else if (corners[i].x > 360 && corners[i].y < 360) {
            corners[i].color = 'green';
            if ((720 - square.b.x) + square.b.y > (720 - corners[i].x) + corners[i].y) {
              square.b.x = corners[i].x;
              square.b.y = corners[i].y;
            }
          } else if (corners[i].x < 360 && corners[i].y > 360) {
            corners[i].color = 'blue';
            if (square.c.x + (720 - square.c.y) > corners[i].x + (720 - corners[i].y)) {
              square.c.x = corners[i].x;
              square.c.y = corners[i].y;
            }
          } else if (corners[i].x > 360 && corners[i].y > 360) {
            corners[i].color = 'orange';
            if (square.d.x + square.d.y < corners[i].x + corners[i].y) {
              square.d.x = corners[i].x;
              square.d.y = corners[i].y;
            }
          }

          new_corners.push(corners[i]);
        }
      }

      jsfeat.math.perspective_4point_transform(transform,
        square.a.x, square.a.y, 0, 0,
        square.b.x, square.b.y, imgWidth, 0,
        square.c.x, square.c.y, 0, imgHeight,
        square.d.x, square.d.y, imgWidth, imgHeight
      );
      jsfeat.matmath.invert_3x3(transform, transform);
      jsfeat.imgproc.warp_perspective(img_u8, img_u8_warp, transform, 0);


      let data_u32 = new Uint32Array(imageData.data.buffer);
      let alpha = (0xff << 24);
      let i = img_u8_warp.cols * img_u8_warp.rows, pix = 0;
      while (--i >= 0) {
        pix = img_u8_warp.data[i];
        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
      }

      this.ctx.putImageData(imageData, 0, 0);
      console.log(new Date().getTime() - this.time);


      /*
      for (let i = 0; i < new_corners.length; i++) {
        this.ctx.beginPath();
        this.ctx.fillStyle = new_corners[i].color;
        this.ctx.rect(new_corners[i].x - 2, new_corners[i].y - 2, 4, 4);
        this.ctx.fill();
      }
      for (let corner in square) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.rect(square[corner].x - 2, square[corner].y - 2, 4, 4);
        this.ctx.fill();
      }
      */

      console.log(square);
      console.log(new_corners);
    };
    this.image.src = dataUrl;
  }

  contrastImage(imgData, contrast) {
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
}
