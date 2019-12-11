// src/camera.page.js file
import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';

import styles from './styles';

export default function CameraPage () {
    camera = null;
    let [captures, setCaptures] = useState([])
    let [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    let [capturing, setCapturing] = useState(null)
    let [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    let [hasCameraPermission, setHasCameraPermission] = useState(null)

    handleCaptureIn = () => {setCapturing(true)};

    handleCaptureOut = () => {
        if (capturing)
            camera.stopRecording();
    };

    handleShortCapture = async () => {
        const photoData = await camera.takePictureAsync();
        setCapturing(false);
        setCaptures([photoData, ...captures])
    };

    handleLongCapture = async () => {
        const videoData = await camera.recordAsync();
        setCapturing(false);
        setCaptures([videoData, ...captures])
    };

    useEffect(() => {
      const componentDidMount = async () => {
          const cam = await Permissions.askAsync(Permissions.CAMERA);
          const aud = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
          const hasCameraPermission = (cam.status === 'granted' && aud.status === 'granted');
          setHasCameraPermission(hasCameraPermission)
      };
      componentDidMount();
    }, []);

    if (hasCameraPermission === null) {
        return <View />;
    } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied.</Text>;
    }

    return (
      <React.Fragment>
          <View>
              <Camera
                  type={cameraType}
                  flashMode={flashMode}
                  style={styles.preview}
                  ref={myCamera => camera = myCamera}
              />
          </View>

          {captures.length > 0 && <Gallery captures={captures}/>}

          <Toolbar
              capturing={capturing}
              flashMode={flashMode}
              cameraType={cameraType}
              setFlashMode={setFlashMode}
              setCameraType={setCameraType}
              onCaptureIn={handleCaptureIn}
              onCaptureOut={handleCaptureOut}
              onLongCapture={handleLongCapture}
              onShortCapture={handleShortCapture}
          />
      </React.Fragment>
    );
};
