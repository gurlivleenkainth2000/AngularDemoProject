import { Component, OnInit, TemplateRef } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, orderBy, query, setDoc, where } from '@angular/fire/firestore';
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
    let queryRef = query(
      collectionRef,
      where("status", "==", true),
      orderBy("prdCode")
    )
    // Read => get | onSnapshot
    // get => Fetched -> not reflect any new changes (create, update, delete) operation
    // onSnapshot => It will relfect all changes
    // getDocs(collectionRef).then((values) => {
    //   this.products = values.docs.map(e => e.data());
    // })
    onSnapshot(queryRef, (values) => {
      this.products = values.docs.map(e => e.data());
    }, (error) => {
      console.log(error);
      
    })
  }

  openProductModal(modalRef: TemplateRef<unknown>, product: any = null) {
    this.modalService.open(modalRef)
    this.initialisedProductForm(product);
  }

  initialisedProductForm(product: any = null) {
    if(product === null) {
      this.productForm = this.fb.group({
        productId: [""],
        prdCode: [""],
        name: [""],
        description: [""],
        price: [null],
        status: [true],
        inStock: [null]
      })
    } else {
      this.productForm = this.fb.group({
        productId: [product.productId],
        prdCode: [product.prdCode],
        name: [product.name],
        description: [product.description],
        price: [product.price],
        status: [product.status],
        inStock: [product.inStock],
      })
    }
  }

  onSubmit(form: FormGroup) {
    let value: any = { ...form.value };

    // Firestore Document => Add / Set methods
    // Add => Collection Name is Required -> auto-generated documentId (uniqueId)
    // Set => Collection + Document Ref
    // In 6.x.x, AngularFirestore => createId() -> uniqueId
    value.productId = value.productId === '' ? doc(collection(this.firestore, "products")).id : value.productId;
    let docRef = doc(this.firestore, "products", value.productId);

    // update => updateDoc with document reference
    setDoc(docRef, { ...value }, { merge: true }) // Create and Update
      .then(() => {
        console.log("Successfully Added");
        this.modalService.dismissAll();
      }, (error) => {
        console.log(error);
      })
  }

  deleteProduct(productId: string) {
    let docRef = doc(this.firestore, "products", productId);
    deleteDoc(docRef)
    .then(() => {
      console.log("Successfully Deleted");
    }, (error) => {
      console.log(error);
    })
  }
}
