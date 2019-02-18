import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';
import {MatInput, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ssccscanner',
  templateUrl: './ssccscanner.component.html',
  styleUrls: ['./ssccscanner.component.scss']
})
export class SSCCScannerComponent implements OnInit {

  @Output() scannedSscc = new EventEmitter<string>();

  @ViewChild('scanner') scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  scannerEnabled = true;
  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  static isStringSSCC(input: string): boolean {
    return /^00376123456\d{9}$/.test(input);
  }

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;
      this.availableDevices = devices;
      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          this.scanner.changeDevice(device);
          return;
        }
      }
      this.scanner.changeDevice(devices[devices.length - 1]);
    });
  }

  handleQrCodeInputResult(manualInput: string) {
    if (SSCCScannerComponent.isStringSSCC(manualInput)) {
      this.scannedSscc.emit(manualInput);
    }
  }

  handleQrCodeScanResult(resultString: string) {
    this.scannerEnabled = false;
    if (!SSCCScannerComponent.isStringSSCC(resultString)) {
      console.log(resultString);
      this.snackBar.open('Not a SSCC QR Code', 'Try again')
        .afterDismissed().subscribe(() => {
        this.scannerEnabled = true;
      });
    } else {
      this.snackBar.open('SSCC successfully scanned', null, {duration: 2000});
      this.scannedSscc.emit(resultString);
    }
  }

}
