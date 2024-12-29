import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useRef, useState } from 'react'
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';

const audioRecorderPlayer = new AudioRecorderPlayer();


const  cameraScreen =  () => {
    const [isCompressing, setIsCompressing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const camera = useRef<Camera>(null);
    const device = useCameraDevice(isFrontCamera ? 'front' : 'back');
    const [showCamera, setShowCamera] = useState(true);
    const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
    const [recordingTime, setRecordingTime] = useState(0);
    const [recording, setRecording] = useState(false);
    const [audioFilePath, setAudioFilePath] = useState('');
    const audiogreen = require('../src/assets/mic-green.png');
    const audiored = require('../src/assets/mic-red.png');
    const [duration, setDuration] = useState(0);
    const [capturedMedia, setCapturedMedia] = useState<any>([]);
    const [uploadalert, setUploadAlert] = useState<any>(0);

    const onStartRecord = async () => {
        try {
            
            const result = await audioRecorderPlayer.startRecorder();

            console.log("result", result)

            setAudioFilePath(result); // Store the recorded audio file path
            setRecording(true);
        } catch (error) {
            console.error('Error starting recorder:', error);
        }
    };
    const onStopRecord = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setRecording(false);
            const normalizedFilePath = result.replace('file://', '');
            setAudioFilePath(normalizedFilePath);
            sendAudioToServer(result);
        } catch (error) {
            console.error('Error stopping recorder:', error);
        }
    };
    const sendAudioToServer = async (filePath: any) => {
        const storedUid = await AsyncStorage.getItem('uid');
        const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
        const formData = new FormData();
        formData.append('uploaded_file', {
            uri: filePath,
            type: 'audio/aac',
            name: filename
        });
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        formData.append('lastModDate', formattedDate);
        formData.append('uid1', storedUid);
        try {
            const apiname = 'UploadToServer.php';
            // const response = await LoginService.uploadimage(apiname, formData);
            const response = ''
            if (response !== undefined && response !== null && response !== '') {
                const storedUid = await AsyncStorage.getItem('uid') as string;
                const countryname = await AsyncStorage.getItem('countryname') as any;
                const countrycode = await AsyncStorage.getItem('countrycode') as any;
                const statename = await AsyncStorage.getItem('statename') as any;
                const city = await AsyncStorage.getItem('city') as any;
                const zipcode = await AsyncStorage.getItem('zipcode') as any;
                const address = await AsyncStorage.getItem('address') as any;
                const districtname = await AsyncStorage.getItem('districtname') as any;
                const latitude = await AsyncStorage.getItem('latitude') as any;
                const longitude = await AsyncStorage.getItem('longitude') as any;
                const shortstatecode = await AsyncStorage.getItem('shortstatecode') as any;
                const amberid = await AsyncStorage.getItem('amberid' as any)
                const apiname = 'ws_offlinedata.php';
                const payload = { country: countryname, countrycode: countrycode, uid: storedUid, lat: latitude, lng: longitude, province: statename, city: city, postal_code: zipcode, formatted_address: address, filename: response, lastdatetime: formattedDate, video_name: filename, shortstatecode: shortstatecode, amberid: amberid }

                // const resmsg = await LoginService.getData(apiname, payload);
                setShowCamera(false);
                Alert.alert(
                    'Upload Status',
                    // resmsg.message,
                    "",
                    [{ text: 'OK' }]
                );
                setShowCamera(true)

            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        };
    };
    const handleCapture = async () => {
        try {
            if (camera.current) {
                if (cameraMode === 'photo') {
                    const photo = await camera.current.takePhoto({});
                    const compressedPhoto = await ImageResizer.createResizedImage(
                        photo.path,
                        800,
                        600,
                        'PNG',
                        80
                    );
                    const mediaItem = {
                        uri: compressedPhoto.uri,
                        type: 'photo',
                        timestamp: Date.now(),
                    };
                    setCapturedMedia((prevMedia: any) => {
                        const newMedia = [...prevMedia, mediaItem];
                        setUploadAlert(newMedia.length); // Update the upload count
                        return newMedia;
                    });
                    // setCapturedMedia((prevMedia: any) => [...prevMedia, mediaItem]);
                    await saveMedia(mediaItem);
                    setShowCamera(true);

                } else if (cameraMode === 'video') {
                    if (!isRecording) {
                        await camera.current.startRecording({
                            onRecordingFinished: async (video) => {
                                const mediaItem = {
                                    uri: video.path,
                                    type: 'video',
                                    timestamp: Date.now(),
                                };
                                setCapturedMedia((prevMedia: any) => {
                                    const newMedia = [...prevMedia, mediaItem];
                                    setUploadAlert(newMedia.length); // Update the upload count
                                    return newMedia;
                                });
                                await saveMedia(mediaItem);
                                // setCapturedMedia((prevMedia: any) => [...prevMedia, mediaItem]);
                                // await saveMedia(mediaItem);
                                setIsRecording(false);
                                setShowCamera(true);

                            },
                            onRecordingError: (error) => {
                                console.error('Recording error:', error);
                                setIsRecording(false);
                            },
                        });
                        setIsRecording(true);

                        // Automatically stop recording after 30 seconds
                        setTimeout(async () => {
                            if (camera.current) {
                                await camera.current.stopRecording();
                                setIsRecording(false);
                            }
                        }, 30000);
                    } else {
                        await camera.current.stopRecording();
                        setIsRecording(false);
                    }
                }
            }
        } catch (error) {
            console.error('Error capturing media:', error);
        }
    };
    const saveMedia = async (media: any) => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia as string) || [];
            existingMedia.push(media);
            await AsyncStorage.setItem('capturedMedia', JSON.stringify(existingMedia));
            //for count
            await AsyncStorage.setItem('mediaCount', (existingMedia.length + 1).toString());
        } catch (error) {
            console.error('Error saving media to AsyncStorage:', error);
        }
    };
    const toggleCameraMode = (mode: 'photo' | 'video') => {
        setCameraMode(mode);
    };
    const toggleCameraPosition = () => {
        setIsFrontCamera((prev) => !prev);
    };
    return (
        <View style={styles.container}>

             {isCompressing && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{ position: 'absolute', top: '50%', left: '50%' }}
                />
            )}
            {isUploading && (
                <ActivityIndicator
                    size="large"
                    color="#00ff00"
                    style={{ position: 'absolute', top: '50%', left: '50%' }}
                />
            )}
            {device ? (
                <>
                    {showCamera && (
                        <View style={[StyleSheet.absoluteFill]}>
                            <Camera
                                ref={camera}
                                style={{ width: '100%', height: '100%' }}
                                device={device}
                                isActive={true}
                                photo={cameraMode === 'photo'}
                                video={cameraMode === 'video'}
                                audio={cameraMode === 'video'}
                            />
                            <View style={styles.timerContainer}>
                                {isRecording && (
                                    <Text style={styles.timerText}>
                                        {`${Math.floor(recordingTime / 60)}:${('0' + (recordingTime % 60)).slice(-2)}`}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.buttonContainer1}>
                                    {/* <TouchableOpacity onPress={handleUpload1} style={styles.uploadButton}>
                                        <Text style={{
                                            position: 'absolute', right: 0, top: 0, backgroundColor: 'red', color: 'white', borderRadius: 12, paddingHorizontal: 5, paddingVertical: 2, fontSize: 12,
                                        }}>{uploadalert}</Text>
                                        <Image
                                            source={require('../assets/images/uploadimg.png')}
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity> */}
                                
                                {!recording && (
                                    <TouchableOpacity onPress={onStartRecord} style={styles.uploadButton}>
                                        <Image source={audiogreen} style={styles.icon} />
                                    </TouchableOpacity>
                                )}
                                {recording && (
                                    <TouchableOpacity onPress={onStopRecord} style={styles.uploadButton}>
                                        <Image source={audiored} style={styles.icon} />
                                    </TouchableOpacity>
                                )}
                                {recording && <Text style={styles.durationText}> {duration}s</Text>}

                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.captureButton, { backgroundColor: isRecording ? '#FF0000' : '#28A745' }]}
                                    onPress={handleCapture}
                                >
                                    <Text style={styles.buttonText}>
                                        {cameraMode === 'photo' ? 'Capture Photo' : isRecording ? 'Stop Video' : 'Start Video'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.modeContainer}>
                                    <TouchableOpacity
                                        style={styles.modeButton}
                                        onPress={() => toggleCameraMode('photo')}
                                    >
                                        <Text style={[styles.buttonText, cameraMode === 'photo' && styles.activeText]}>
                                            Photo
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modeButton}
                                        onPress={() => toggleCameraMode('video')}
                                    >
                                        <Text style={[styles.buttonText, cameraMode === 'video' && styles.activeText]}>
                                            Video
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleCameraPosition} style={styles.refreshButton}>
                                        <Image
                                            source={require('../src/assets/refresh.png')}
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    )}
                </>
            ) : (
                <Text style={styles.noCameraText}>No camera device available</Text>
            )} 

      </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    },
    noCameraText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'red',
        margin: 20,
    },
    timerContainer: {
        position: 'absolute',
        top: 50,
        left: '50%',
        transform: [{ translateX: -50 }],
        zIndex: 101,
    },
    timerText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 10,
    },
    buttonContainer1: {
        position: 'absolute',
        right: 20,
    },
    uploadButton: {
        padding: 10,
        marginHorizontal: 5,
        marginTop: 20,
        marginRight: 5
    },
    icon: {
        width: 40,
        height: 40,
        marginTop: -10
    },
    durationText: {
        marginTop: 5,
        fontSize: 18,
        color: 'white'
    },
    buttonContainer: {
        position: 'absolute',
        top: '70%',
        left: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonTexts: {
        color: '#fff',
        fontSize: 16,
    },
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: 'transparent', // Ensure background is transparent
    },
    activeText: {
        color: '#FFFF00', // Highlight color for active text
        fontWeight: 'bold', // Optional: make text bold
    },
    refreshButton: {
        padding: 10,
        marginHorizontal: 5,
        alignSelf: 'center',
    },
})

export default cameraScreen