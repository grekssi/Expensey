import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectImagesByEmail } from "../features/imagesSlice";
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { setImages } from "../features/imagesSlice";
import { removeEmail } from "../features/emailsSlice";
import styles from "../styles";
import ExpenseItem from "../components/ExpenseItem";

const ImagesScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState([]);
  const [fotterVisible, setFooterVisible] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (fotterVisible) {
      const timeout = setTimeout(() => {
        setFooterVisible(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [fotterVisible]);

  useEffect(() => {
    fetchImages();
  }, []);

  const dispatch = useDispatch();
  const email = route.params.email;

  useEffect(() => {
    // Only execute the hook's logic if the current user's email matches the provided email
    if(auth?.currentUser?.email !== email) {
  
      // Set the headerRight component
      const headerRightComponent = () => (
        <Text style={styles.Images.removeUserText}
          onPress={async () => {
  
            const userAccessQuery = query(
              collection(db, "UserAccess"),
              where("AccessUser", "==", email),
              where("ParentUser", "==", auth?.currentUser?.email),
            );
  
            var doc1 = null;
  
            //just in case there occurs a bug which added multiple identical emails
            const querySnapshot = await getDocs(userAccessQuery);
            querySnapshot.forEach(async (doc) => {
              doc1 = doc;
            });
  
            var emailToRemove = doc1.data().AccessUser;
  
            const docRef = doc(db, "UserAccess", doc1.id);
            await deleteDoc(docRef);
            dispatch(removeEmail(emailToRemove));
            navigation.goBack();
          }}>
          Remove User
        </Text>
      );
  
      // Set the options for the current screen
      navigation.setOptions({
        headerRight: headerRightComponent,
      });
    }
  }, [auth, email, navigation, dispatch]); // Add dependencies to the useEffect hook
  

  navigation.setOptions({
    title: email
  })



  const handleLongPress = (image, month, index) => {
    if (selectedImages.some(selectedImage => selectedImage.url === image.url)) {
      setSelectedImages(selectedImages.filter(selectedImage => selectedImage.url !== image.url));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  async function handleMarkAsPaid() {
    try {
      for (let image of selectedImages) {
        const docRef = doc(db, "UserImages", image.Id); // Make sure `image.id` is the id of the document
        await updateDoc(docRef, { IsPaid: "paid" });
      }
      console.log("All selected images marked as paid.");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    finally {
      fetchImages();
      setSelectedImages([]);
    }
  };

  async function handleDelete() {
    try {
      for (let image of selectedImages) {
        const docRef = doc(db, "UserImages", image.Id); // Make sure `image.id` is the id of the document
        await updateDoc(docRef, { IsDeleted: true });
      }
      console.log("All selected images deleted.");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
    finally {
      fetchImages();
      setSelectedImages([]);
    }
  };

  async function handleMarkAsUnpaid() {
    try {
      for (let image of selectedImages) {
        const docRef = doc(db, "UserImages", image.Id); // Make sure `image.id` is the id of the document
        await updateDoc(docRef, { IsPaid: "unpaid" });
      }
      console.log("All selected images marked as unpaid.");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    finally {
      fetchImages();
      setSelectedImages([]);
    }
  };

  function organizeData(data) {
    return data.reduce((acc, curr) => {
      const { Date, Amount, Email, ImageUrl, IsPaid, Id, IsDeleted } = curr;
      const amount = parseFloat(Amount);  // convert Amount to number
      const [month, year] = Date.split('/');

      const newData = {
        amount,
        email: Email,
        month: Date,
        url: ImageUrl,
        year: parseInt(year, 10),
        IsPaid: IsPaid,
        Id: Id,
        IsDeleted: IsDeleted
      };

      if (!acc[Date]) {
        acc[Date] = [newData];
      } else {
        acc[Date].push(newData);
      }

      return acc;
    }, {});
  };

  async function fetchUserImages() {
    const userImagesCol = collection(db, 'UserImages');
    const userImagesSnapshot = await getDocs(userImagesCol);
    const userImages = userImagesSnapshot.docs.map(doc => ({ ...doc.data(), Id: doc.id }));

    return userImages;
  }

  async function fetchImages() {
    try {
      fetchUserImages()
        .then(userImages => {
          const organizedData = organizeData(userImages);
          dispatch(setImages(organizedData));
        })
        .catch(error => {
          console.log('Error fetching user images:', error);
        });

    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <View style={styles.Images.container}>

      <ScrollView contentContainerStyle={styles.Images.scrollView}>
        {Object.entries(
          useSelector((state) => selectImagesByEmail(state, email))
        ).map(([month, images]) => (
          <ExpenseItem
            key={`${month}-${images.id}`} 
            month={month}
            images={images}
            handleLongPress={handleLongPress}
            selectedImages={selectedImages}
            setFooterVisible={setFooterVisible}
            setModalImage={setModalImage}
            setModalVisible={setModalVisible}
          />
        ))}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{ margin: 0, padding: 0 }}
        >
          <View style={styles.Images.viewerContainer}>
            <ImageViewer
              imageUrls={modalImage}
              enableSwipeDown={true}
              minScale={1}
              maxScale={2}
              renderIndicator={() => null}
              onSwipeDown={() => {
                setModalVisible(false);
                setFooterVisible(false)
              }}
            />
            {fotterVisible && (
              <View style={styles.Images.footerView}>
                <View style={styles.Images.textContainer}>
                  <Text style={styles.Images.footerText}>Swipe down to close</Text>
                </View>
              </View>
            )}
          </View>
        </Modal>
      </ScrollView>

      {selectedImages.length > 0 && (
        <View style={styles.Images.floatingFooter}>


          <TouchableOpacity
            style={styles.Images.footerSetPaid}
            onPress={handleMarkAsPaid}>
            <Image
              style={styles.Images.footerImage}
              source={require("../assets/checkmark_white.png")}>
            </Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Images.footerSetUnPaid}
            onPress={handleMarkAsUnpaid}>
            <Image
              style={styles.Images.footerImage}
              source={require("../assets/Xbutton_white.png")}>
            </Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Images.footerSetDeleted}
            onPress={handleDelete}>
            <Image
              style={styles.Images.footerImageTrash}
              source={require("../assets/trash_white.png")}>
            </Image>
          </TouchableOpacity>

          <View style={styles.Images.footerView}>
            <Text style={styles.Images.footerSelectedTextContainer}>
              {selectedImages.length} item(s) selected
            </Text>
          </View>
        </View>
      )}
    </View>


  );
};

export default ImagesScreen;
