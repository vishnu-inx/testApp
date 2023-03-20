import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    inventoryData: any = [];
    times = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
    guests = [2, 4, 6, 8, 10];
    bookRoomForm!: FormGroup;
    minDate: any;
    selectedDate: any;
    errorMessage: any;
    

    constructor(private formBuilder: FormBuilder, private httpService: AppService) {
        this.minDate = new Date().toISOString().split('T')[0];
        this.createFormBookRoom();
    }

    ngOnInit(): void {
        this.getInventory(); 
    }

    get f() {
        return this.bookRoomForm.controls;
    }

    getInventory(guest?: any) {
        this.inventoryData = [];
        this.errorMessage = null;
        this.httpService.getInventory().subscribe((res: any) => {
            let data = res.result;
            if (guest) {
                this.inventoryData = data.filter((el: any) => el.capacity == guest);
                console.log("inventory...with guest", this.inventoryData);
                if (this.inventoryData.length === 0) {
                    this.errorMessage = "Room not found for selected guest change number of guest or change time slot"
                    // console.log("No data found ! Error ...", this.errorMessage);
                }
            } else {
                this.inventoryData = data;
                // console.log("inventory...without guest", this.inventoryData);
            }
        })
    }

    onSubmit(): void {
        if (this.bookRoomForm.invalid) {
            for (const control of Object.keys(this.bookRoomForm.controls)) {
                this.bookRoomForm.controls[control].markAsTouched();
            }
            return;
        }

        const payload =  {
            guest : this.bookRoomForm.value.guest,
            date: this.bookRoomForm.value.date,
            room: this.bookRoomForm.value.room,
            time: this.bookRoomForm.value.time,
            email: this.bookRoomForm.value.email,
            phone: this.bookRoomForm.value.phone,
            fname: this.bookRoomForm.value.fname,
            lname: this.bookRoomForm.value.lname,
        }

        this.bookRoomForm.reset();
        this.createFormBookRoom();

        console.log(payload);
    }

    activeButtonClass($event: any) {
        let clickedElement = $event.target || $event.srcElement;
        // debugger;
        if (clickedElement.nodeName === "DIV") {

            let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
            // if a Button already has Class: .active
            if (isCertainButtonAlreadyActive) {
                isCertainButtonAlreadyActive.classList.remove("active");
            }

            clickedElement.className += " active";
        }
    }

    getDate(val: any) {
        console.log(val);
    }

    createFormBookRoom() {
        this.bookRoomForm = this.formBuilder.group(
            {
                guest: ['', [Validators.required]],
                date: ['', [Validators.required]],
                room: ['', [Validators.required]],
                time: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                phone: ['', [Validators.required]],
                fname: ['', [Validators.required]],
                lname: ['']
            });
    }



}
