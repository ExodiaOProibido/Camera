// Componente Camera
// Importações do hooks useState, useEffect, useRef
import React, { useState, useEffect, useRef } from 'react';
// Importação dos componenentes react native que serão usado na tela
import {Button, StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native'
// Importação do Expo-Câmera
import {CameraView, useCameraPermissions} from "expo-camera";

function CameraComponent(){
    // Estado que define se a câmera será frontal ou traseira 'front' ou 'back'
    const [facing, setFacing] = useState('back');

    // hook do expo para lidar com permissão do usuario
    // permission = estado da permissão
    // requestpermission = função que solicita a permissão ao usuário
    const [permission, requestPermission] = useCameraPermissions();

    // Estado para guardar a foto capturada
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    // Referência para acesso direto aos métodos da câmera
    const cameraRef = useRef(null);

    // Executa quando o componente é montado
    useEffect(() => {
        // Solicita permissão assim que o componente é montado
        requestPermission();
},[])

// Caso permission não tenha tido retorno ainda
if (!permission) { return <View />;}

// Retorno com a permissão não concedida
if (!permission.granted){
    return (
        <View style={styles.container}>
            <Text style={{textAlign:'center'}}> Preciso de sua permissão para rodar</Text>
            <Button onPress={requestPermission} title="Conceder Permissão!"/>
        </View>
    );
}

// Função para alternar entre câmera frontal e câmera traseira
function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
}

// Função que tira uma foto - função assincrona
async function takePicture() {
    if (cameraRef.current) {
        // Usa a referência da câmera para capturar uma foto
        const photo = await cameraRef.current.takePictureAsync();
        // Guarda a foto capturada no estado 'capturedPhoto'
        setCapturedPhoto(photo);

        console.log(photo.uri);
    }
}

// Caso haja uma foto capturada esta é exibida
if (capturedPhoto) {
    return (
        <View style={styles.container}>
            <View style={styles.tirar_outra}>
                <Button title="Tirar outra foto" onPress={() => setCapturedPhoto(null)}/>
            </View>
            <Image source={{ uri:capturedPhoto.uri}} styles={styles.preview}/>
        </View>
    );
}

// Renderizacao padrão (ainda sem foto tirada)
return (
    <View>
        <CameraView facing={facing} ref={cameraRef} style={styles.camera}>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style ={styles.button} onPress={toggleCameraFacing}>
                <Text>Virar Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style ={styles.button} onPress={takePicture}>
                <Text style={styles.text}>Tirar Foto</Text>
            </TouchableOpacity>
            </View>
        </CameraView>
              </View>
);  
}export default CameraComponent;

// Estilos usados no componente
const styles = StyleSheet.create({
    tirar_outra: {marginTop: 50}, 
    container: { 
        flex: 1, 
        justifyContent: 'center' }, 
    camera: {flex: 1}, 
    button: {
        flex: 1, 
        alignSelf: 'flex-end', 
        alignItems: 'center' },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row', 
        backgroundColor: 'transparent',
        margin: 64},
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white' },
    preview: {
        flex: 1,
        resizeMode: 'contain' }
});