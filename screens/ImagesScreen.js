import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectImagesByEmail } from "../features/imagesSlice";
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  selectImages,
  selectUserEmails,
  setImages,
} from "../features/imagesSlice";

const windowWidth = Dimensions.get("window").width;

const getTotalAmount = (images) => {
  return images.reduce((total, image) => total + image.amount, 0);
};

const ImagesScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const email = route.params.email;

  console.log(email);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState([]);
  const [fotterVisible, setFooterVisible] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const handleLongPress = (image, month, index) => {
    if (selectedImages.some(selectedImage => selectedImage.url === image.url)) {
      setSelectedImages(selectedImages.filter(selectedImage => selectedImage.url !== image.url));
    } else { // Otherwise, select the image
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleMarkAsPaid = async () => {
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

  const handleDelete = async () => {
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

  const handleMarkAsUnpaid = async () => {
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

  const organizeData = (data) => {
    return data.reduce((acc, curr) => {
      const { Date, Amount, Email, ImageUrl, IsPaid, Id } = curr;
      const amount = parseFloat(Amount);  // convert Amount to number

      // split Date into month and year
      const [month, year] = Date.split('/');

      // define the new structure
      const newData = {
        amount,
        email: Email,
        month: Date,
        url: ImageUrl,
        year: parseInt(year, 10),
        IsPaid: IsPaid,
        Id: Id
      };

      // check if Date exists in accumulator
      if (!acc[Date]) {
        // if it does not exist, create a new array
        acc[Date] = [newData];
      } else {
        // if it exists, push the new data into the array
        acc[Date].push(newData);
      }

      // return the accumulator for the next iteration
      return acc;
    }, {});
  };

  const fetchUserImages = async () => {
    const userImagesCol = collection(db, 'UserImages');
    const userImagesSnapshot = await getDocs(userImagesCol);
    const userImages = userImagesSnapshot.docs.map(doc => ({ ...doc.data(), Id: doc.id }));
    return userImages;
  }

  const fetchImages = async () => {
    console.log("fetching");
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
    console.log("fetching effect")
  }, []);

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollView} key={refresh}>
        {Object.entries(
          useSelector((state) => selectImagesByEmail(state, email))
        ).map(([month, images]) => (
          <View key={month} style={styles.monthContainer}>
            <Text style={styles.monthTitle}>
              {month} - {getTotalAmount(images)} Лв.
            </Text>
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleLongPress(image, month, index)}
                style={[
                  styles.imageRow,
                  selectedImages.some(selectedImage => selectedImage.url === image.url)
                    ? { backgroundColor: "darkgray" }
                    : image.IsPaid === "paid"
                      ? { backgroundColor: "rgba(56,209,0,0.6)" }
                      : image.IsPaid === "unpaid"
                        ? {}
                        : {}
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setFooterVisible(true);
                    setModalImage([{ url: image.url }]);
                    setModalVisible(true);
                  }}
                >
                  <Image source={{ uri: image.url }} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.imageAmount}>{image.amount} Лв.</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{ margin: 0, padding: 0 }}
        >
          <View style={styles.viewerContainer}>
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
              <View style={styles.footerView}>
                <View style={styles.textContainer}>
                  <Text style={styles.footerText}>Swipe down to close</Text>
                </View>
              </View>
            )}
          </View>
        </Modal>
      </ScrollView>

      {selectedImages.length > 0 && (
        <TouchableOpacity style={styles.footerSetPaid}
          onPress={handleMarkAsPaid}>
          <Text style={styles.footerSelectedTextContainer}>
            Mark Paid
          </Text>
        </TouchableOpacity>
      )}

      {selectedImages.length > 0 && (
        <TouchableOpacity style={styles.footerSetUnPaid}
          onPress={handleMarkAsUnpaid}>
          <Text style={styles.footerSelectedTextContainer}>
            Mark Unpaid
          </Text>
        </TouchableOpacity>
      )}

      {selectedImages.length > 0 && (
        <TouchableOpacity style={styles.footerSetDeleted}
          onPress={handleDelete}>
          <Text style={styles.footerSelectedTextContainer}>
            Delete
          </Text>
        </TouchableOpacity>
      )}


      {selectedImages.length > 0 && (
        <View style={styles.footerView}>
          <Text style={styles.footerSelectedTextContainer}>
            {selectedImages.length} item(s) selected
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F3F3F3",
  },
  monthContainer: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#424242",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    width: "100%",
    padding: 8,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imageAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',  // semi-transparent background
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',  // make the image fit within the screen
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  viewerContainer: {
    flex: 1,
    margin: 0,
  },
  footerView: {
    position: 'absolute',
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  footerSetPaid: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    zIndex: 1,
    backgroundColor: 'rgba(56,209,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  footerSetUnPaid: {
    position: 'absolute',
    bottom: 100,
    left: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    zIndex: 1,
    backgroundColor: 'rgba(225,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  footerSetDeleted: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    zIndex: 1,
    backgroundColor: 'rgba(225,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 5,
  },
  footerText: {
    color: 'white',
    padding: 5,
    flex: 1,
    textAlign: 'center',
  },
  footerSelectedTextContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 5,
    color: 'white'
  },
  container: {
    flex: 1,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
});

export default ImagesScreen;
