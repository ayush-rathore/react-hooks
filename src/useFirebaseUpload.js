import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function useFirebaseUpload(uri) {
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError("Network request failed"));
		};
		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send(null);
	});

	const customUri = "CUSTOM_URL"; // Example "images/image.jpg"
	let URL;

	const fileRef = ref(getStorage(), customUri);
	await uploadBytes(fileRef, blob)
		.then(() => console.log("Uploaded!"))
		.catch((err) => console.log(err));

	blob.close();

	await getDownloadURL(ref(getStorage(), customUri))
		.then((url) => {
			URL = url;
		})
		.catch((error) => {
			console.log(error);
		});

	return URL;
}

export default useFirebaseUpload;
