import { getFirestore, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadImageToFirebase(pickedImage) {
    try {
        const response = await fetch(pickedImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now() + '_' + Math.floor(Math.random() * Math.floor(1000))}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        const downloadURL = await new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // You can add a progress indicator here if you want
                },
                (error) => {
                    console.error('Error fetching downloadURL', error);
                    reject(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

export async function addNewDocument(email, date, amount, imageUrl, isPaid) {
    const db = getFirestore();

    const newDocument = {
        Email: email,
        Date: date,
        Amount: amount,
        ImageUrl: imageUrl,
        IsPaid: isPaid,
        IsDeleted: false
    };

    try {
        const docRef = await addDoc(collection(db, "UserImages"), newDocument);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
