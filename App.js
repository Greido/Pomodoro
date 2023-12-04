import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Platform ,Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import {Audio} from "expo-av"
const colors = ["#e8b5f7","#d191f7","#9356a0"]


export default function App() {

  //Variable para largar el boton
  const [isRunning, setIsRunnig]= useState(false);

  //Variable para mantener el tiempo que llevamos
  const [time, setTime]= useState(25 * 60);

  //Variable para saber en que tiempo estamos o en que tab estamos
  const [currentTime, setCurrentTime]= useState("POMO"|"SHORT"|"BREAK");

  //Variable para el boton dependiendo si esta activo o no
  const [isActive,setIsActive]= useState(false);


  //Agregamos la funcionalidad principal del timer

  useEffect(()=>{
    let interval = null;


    if(isActive){
      //Run timer
      interval = setInterval(()=>{
        setTime(time-1)
      },1000)
    }else{
      //Clear interval
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setIsRunnig(prev => !prev)
      setTime(isRunning ? 300 : 1500);
    }

    return()=>clearInterval(interval)
  },[isActive, time])



  //Funcion para manejar el cambio del boton para activar el timer

  function handleStartStop(){
    playSound()
    setIsActive(!isActive);
  }

  async function playSound (){
    const {sound} = await Audio.Sound.createAsync(
      require("./assets/Click.mp3")
    )
    await sound.playAsync()
  }

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:colors[currentTime]}]}>
    <View style={{flex:1, paddingHorizontal:15, paddingTop: Platform.OS === 'android' && 30}}>
      <Text
      style={styles.text}>
        Pomodoro
      </Text>      

        {/* Importacion del Header */}
        <Header 
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        setTime={setTime}
         />


        {/* Importacion del timer */}

        <Timer
        time={time}
        />

        {/* Creamos el boton */}

        <TouchableOpacity style={styles.boton} onPress={handleStartStop}>
          <Text
          style={{color:"white",fontWeight:"bold"}}
          >
            {isActive ? "STOP" :"START"}
          </Text>
        </TouchableOpacity>


      </View>
      </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  text:{
    fontSize:32,
    fontWeight:'bold'
  },
  
  boton:{
    alignItems:'center',
    backgroundColor:"#333333",
    padding:15,
    marginTop:15,
    borderRadius:15
  }
});
