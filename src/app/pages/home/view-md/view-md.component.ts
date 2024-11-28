import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonAlert } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeCircleOutline, trashOutline } from 'ionicons/icons';

@Component({
    selector: 'ViewMd',
    templateUrl: './view-md.component.html',
    styleUrls: ['./view-md.component.scss'],
    standalone: true,
    imports: [IonAlert, IonIcon,]
})
export class ViewMdComponent {
    @Input() data: any = {}
    @Output() handleClose = new EventEmitter<void>();
    @Output() handleDelete = new EventEmitter<any>();

    constructor() {
        addIcons({ closeCircleOutline, trashOutline });
    }

    public alertButtons = [
        {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Alert canceled');
            },
        },
        {
            text: 'OK',
            role: 'confirm',
            handler: () => {
                console.log('Alert confirmed');
            },
        },
    ];


    _handleClose() {
        this.handleClose.emit()
    }

    _handleDelete(ev: any, id: any) {
        console.log(ev.detail.role, id);

        if (ev.detail.role === 'confirm') {
            this.handleDelete.emit(id)
        }
    }

}