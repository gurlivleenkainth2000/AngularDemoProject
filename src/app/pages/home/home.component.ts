import { Component, OnInit, TemplateRef } from '@angular/core';
import { collection, doc, Firestore, getDocs, onSnapshot, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  productForm: FormGroup = new FormGroup({});
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    this.getAllProductsFromFirestore();
  }

  getAllProductsFromFirestore() {
    let collectionRef = collection(this.firestore, "products");

    // Read => get | onSnapshot
    // get => Fetched -> not reflect any new changes (create, update, delete) operation
    // onSnapshot => It will relfect all changes
    // getDocs(collectionRef).then((values) => {
    //   this.products = values.docs.map(e => e.data());
    // })
    onSnapshot(collectionRef, (values) => {
      this.products = values.docs.map(e => e.data());
    })
  }

  openProductModal(modalRef: TemplateRef<unknown>) {
    this.modalService.open(modalRef)
    this.initialisedProductForm();
  }

  initialisedProductForm() {
    this.productForm = this.fb.group({
      productId: [""],
      prdCode: [""],
      name: [""],
      description: [""],
      price: [null],
      status: [true],
      inStock: [null]
    })
  }

  onSubmit(form: FormGroup) {
    let value: any = { ...form.value };

    // Firestore Document => Add / Set methods
    // Add => Collection Name is Required -> auto-generated documentId (uniqueId)
    // Set => Collection + Document Ref
    // In 6.x.x, AngularFirestore => createId() -> uniqueId
    value.productId = value.productId === '' && doc(collection(this.firestore, "products")).id;
    let docRef = doc(this.firestore, "products", value.productId);
    setDoc(docRef, { ...value })
      .then(() => {
        console.log("Successfully Added");
        this.modalService.dismissAll();
      }, (error) => {
        console.log(error);
      })
  }
}
