import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Images = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#F3F3F3",
        paddingBottom: 70
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
        bottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        left: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row',
    },
    footerSetPaid: {
        position: 'absolute',
        bottom: 7,
        right: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 5,
        flexDirection: 'row',
    },
    footerSetUnPaid: {
        position: 'absolute',
        bottom: 7,
        right: 70,
        width: 50,
        height: 50,
        tintColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 5,
        flexDirection: 'row',
    },
    footerSetDeleted: {
        position: 'absolute',
        bottom: 7,
        right: 130,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 5,
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
        borderRadius: 5,
        color: 'black',
        fontSize: 18,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
    },
    floatingFooter: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        width: windowWidth,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        borderTopColor: "lightgray",
        borderTopWidth: 1,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    footerImage: {
        tintColor: '#424242',
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        width: 50,
    },
    footerImageTrash: {
        tintColor: '#424242',
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: 30,
    },
    removeUserText: {
        marginRight: 10,
        color: '#424242',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const ImagePicker = StyleSheet.create({
    validationModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    imageContainer: {
        alignSelf: 'center',
        height: windowHeight * 0.3,
    },
    scrollViewContainer: {
        flex: 1,
        flexDirection: 'column',
        height: windowHeight,
        backgroundColor: '#F1F1F1',
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    openModalButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    openModalButtonText: {
        color: 'white',
        fontSize: 18,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
    },
    button: {
        width: 300,
        backgroundColor: 'gray',
        height: 56,
        borderRadius: 9999,
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        marginTop: '50%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
        borderRadius: 5,
    },
    submitButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 0,
        width: 80,
        backgroundColor: '#2196F3',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginHorizontal: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        width: windowWidth * 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    monthContainer: {
        alignSelf: 'center',
        flexDirection: 'column',
        width: windowWidth * 0.9,
        gap: 7,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageRow: {
        width: windowWidth * 0.7, // 50% of the window width
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    image: {
        width: windowWidth * 0.9, // 90% of the window width
        height: windowHeight * 0.4, // 40% of the window height
    },

    openButton: {
        width: 100,
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0,0,0,0.5)" // this is the grayed-out background
    },
});

const Login = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        backgroundColor: "#F3F3F3",
    },
    logo: {
        width: 180,
        height: 180,
        marginTop: 100
    },
    inputBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        borderColor: "#2196F3",
        borderWidth: 1,
    },
    inputContainer: {
        width: 300,
        marginTop: 100
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        borderColor: "#2196F3",
        borderWidth: 1,
        color: "#424242",
        textAlign: "center",
        height: 40,
        width: 300
    },
    passwordContainer: {
        width: 300,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    eyeIcon: {
        marginLeft: 10,
        marginBottom: 10
    },
    button: {
        width: 200,
        marginTop: 10,
    },
    loginButton: {
        backgroundColor: "#2196F3",
        borderRadius: 10,
    },
    registerButton: {
        color: "2196F3",
        borderColor: "#2196F3",
        borderRadius: 10,
        borderWidth: 2,
    },
    buttonText: {
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

const Register = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    button: {
        width: 200,
        marginTop: 10
    },
    inputContainer: {
        width: 300
    },

});

const Users = StyleSheet.create({
    scannerContainer: {
        flex: 1,
        backgroundColor: 'black',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
    },
    activityIndicator: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        position: "absolute",
    },
    backgroundButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        paddingHorizontal: 20,
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    scrollView: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#F3F3F3",
        paddingBottom: 70,
    },
    userContainer: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userEmail: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#424242",
    },
    floatingButtonWide: {
        position: "absolute",
        bottom: 7,
        left: 20,
        backgroundColor: "lightgray",
        borderRadius: 10,
        paddingHorizontal: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "white",
        borderWidth: 1,
    },
    floatingFooter: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        width: windowWidth,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        borderTopColor: "lightgray",
        borderTopWidth: 1,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    floatingButtonqr: {
        position: 'absolute',
        bottom: 7,
        right: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 5,
        flexDirection: 'row',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 7,
        right: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 5,
        flexDirection: 'row',
    },
    existingUserText: {
        position: 'absolute',
        bottom: 90,
        color: "white",
        left: '35%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#424242",
    },
    wideButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#424242",
    },
    backdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default {
    Images,
    ImagePicker,
    Login,
    Register,
    Users
};
