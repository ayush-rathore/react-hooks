import { useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { Audio } from "expo-av";
// See https://docs.expo.dev/versions/latest/sdk/audio/#api

const useRecord = () => {
	const [recording, setRecording] = useState();
	const [recordingURL, setRecordingURL] = useState();
	const [duration, setDuration] = useState();

	async function startRecording() {
		ToastAndroid.show("Recording started...", ToastAndroid.SHORT);
		try {
			const permission = await Audio.requestPermissionsAsync();

			if (permission.status === "granted") {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: true,
					playsInSilentModeIOS: true,
				});

				const { recording } = await Audio.Recording.createAsync(
					Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
					// See https://docs.expo.dev/versions/latest/sdk/audio/#recordingoptions
				);

				setRecording(recording);
				console.log("Recording Started...");
			} else {
				Alert.alert("Please grant permission to access the microphone");
			}
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	}

	async function stopRecording() {
		ToastAndroid.show("Recording stopped...", ToastAndroid.SHORT);
		setRecording(undefined);
		await recording.stopAndUnloadAsync();

		let updatedRecording;
		const { sound, status } = await recording.createNewLoadedSoundAsync();

		updatedRecording = {
			sound,
			duration: getDurationFormatted(status.durationMillis),
			file: recording.getURI(),
		};
		setRecordingURL(updatedRecording.file);
		setDuration(updatedRecording.duration);
		console.log("Recording Stopped...");
	}

	function getDurationFormatted(millis) {
		const minutes = millis / 1000 / 60;
		const minutesDisplay = Math.floor(minutes);
		const seconds = Math.round((minutes - minutesDisplay) * 60);
		const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
		return `${minutesDisplay}:${secondsDisplay}`;
	}

	return {
		startRecording,
		stopRecording,
		recording,
		recordingURL,
		duration,
	};
};

export default useRecord;
