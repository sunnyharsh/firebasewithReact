import React, { Component } from "react";
import "./root.css";

import config from "../firbase.cinfig";
import firebase from "firebase";
import "firebase/firestore";
import FileUploader from "react-firebase-file-uploader";
import NavBar from "../NavBar";
firebase.initializeApp(config);
const db = firebase.firestore();

class App extends Component {
    state = {
        images: []
    };
    componentDidMount() {
        db.collection("uploadImage")
            .get()
            .then(result => {
                result.forEach(doc => {
                    this.setState({
                        images: this.state.images.concat(doc.data())
                    });
                });
            });
    }
    //this function fire during file upload on firebase
    handleUploadStart = () => {
        console.log("image uploading....");
    };
    //this function fire after file upload on firebase
    handleUploadSuccess = filename => {
        console.log(filename);

        firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                firebase
                    .storage()
                    .ref("images")
                    .child(filename)
                    .getMetadata()
                    .then(result => {
                        var newDoc = db.collection("uploadImage").doc();
                        newDoc.set({
                            imageName: filename,
                            imageUrl: url,
                            docRef: newDoc.id,
                            size: result.size
                        });
                        db.collection("uploadImage")
                            .doc(newDoc.id)
                            .get()
                            .then(result => {
                                console.log(result.data());
                                this.setState({
                                    images: this.state.images.concat(
                                        result.data()
                                    )
                                });
                            });
                    });
            });
    };
    handleClick = (e, data, i) => {
        firebase
            .storage()
            .ref("images")
            .child(data.imageName)
            .delete()
            .then(result => {
                db.collection("uploadImage")
                    .doc(data.docRef)
                    .delete()
                    .then(result => {
                        var removeItem = this.state.images;
                        removeItem.splice(i, 1);
                        this.setState({
                            images: removeItem
                        });
                    });
            });
    };
    render() {
        console.log(this.state.images);
        return (
            <div>
                <NavBar />
                <br />
                <br />
                <div className="container">
                    {this.state.images.map((obj, index) => (
                        <div key={index} className="images">
                            <img
                                src={obj.imageUrl}
                                alt=""
                                style={{ width: "200px" }}
                                onClick={e => this.handleClick(e, obj, index)}
                            />
                            <p>{obj.imageName}</p>
                        </div>
                    ))}
                </div>
                <br />
                <br />
                <br />
                <div className="uploaderClass">
                    <label
                        style={{
                            backgroundColor: "steelblue",
                            color: "white",
                            padding: 10,
                            borderRadius: 4
                        }}
                    >
                        <FileUploader
                            accept="image/*"
                            randomizeFilename
                            storageRef={firebase.storage().ref("images")}
                            onUploadStart={this.handleUploadStart}
                            onUploadSuccess={this.handleUploadSuccess}
                        />
                    </label>
                </div>
            </div>
        );
    }
}

export default App;
