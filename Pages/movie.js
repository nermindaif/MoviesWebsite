import React,{ useState, useEffect} from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
// import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';


async function fetchMovies(){
    try{
        const response = await axios.get('http://api.themoviedb.org/3/search/movie?api_key=b3070a5d3abfb7c241d2688d066914e7&query=Rocky&page=1');
        console.log(response);
        return response;
    }
    catch(error){
        console.log(error)
    }
  }


export default function Movie(){
    const [moviesData, setValueMovies]=useState([]);
    var movie=[]
    const [screenWidth, setWindowSize] = useState(undefined);
    useEffect(()=>{
            fetchMovies().then(response =>{
                setValueMovies(response.data.results)  
            }); 
            function handleResize() {
                setWindowSize(Math.round(Dimensions.get('window').width));
            }
            window.addEventListener("resize", handleResize);
            handleResize()
    },[]);
    const link=window.location.href
    var id=link.search('Movie')
    id+=6
    id=link.substring(id,link.length)
    for (var i=0; i<moviesData.length; i++){
        if(moviesData[i].id==id){
            movie=moviesData[i]
            break;
        }
    }
    const PhotoWrapper= screenWidth > 767? styles.PhotoWrapper: styles.PhotoWrapperMedia
    const PhotoDescription= screenWidth > 767? styles.PhotoDescription: styles.PhotoDescriptionMedia
    const PhotoDescriptionH2 = screenWidth > 991 ? styles.PhotoDescriptionH2: styles.PhotoDescriptionH2Media
    const H5 = screenWidth > 991 ? styles.H5: styles.H5Media
    const PhotoContainer= screenWidth > 767? styles.PhotoContainer: styles.PhotoContainerMedia

    return(
            <View style={styles.Container}>
                <View style={PhotoWrapper}>
                    <View style={PhotoContainer}>
                        <img style={ImgResponsive2} src= {"http://image.tmdb.org/t/p/w92/"+movie.poster_path}/>
                    </View>
                    <View style={PhotoDescription}>
                        <Text h2 style={PhotoDescriptionH2}>{movie.original_title}</Text>
                        <Text style={H5}> 
                            <FontAwesomeIcon icon={['fas', 'star']} style={{color:"	#FFD700", marginRight:"10px"}}/>
                            <Text h5 style={styles.rightSide}>{movie.vote_average}</Text>
                        </Text>
                        <Text h5 style={H5}>Votes:  <Text h5 style={styles.rightSide}>{movie.vote_count}</Text></Text>
                        <Text h5 style={H5}>Popularity:  <Text h5 style={styles.rightSide}>{movie.popularity}</Text></Text>
                        <Text h5 style={H5}>Release Date:  <Text h5 style={styles.rightSide}>{movie.release_date}</Text></Text>
                        <Text h5 style={H5}>Language:  <Text h5 style={styles.rightSide}>{movie.original_language}</Text></Text>
                        <Text h5 style={H5}><Text h5 style={styles.rightSide}>{movie.overview} </Text></Text>
                    </View>
                </View>
            </View>
    );
}
const ImgResponsive2={
    display: "block",
    width:"50%",
    height: "100%",
    height: "auto",
    verticalAlign: "middle",
    border: "0",
    paddingLeft: "50px",
}
const styles = StyleSheet.create({
    Container:{
        backgroundColor:"#181818",
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontWeight: "700",
    },
    ImgResponsive2:{
        display: "block",
        width:"50%",
        height: "100%",
        height: "auto",
        verticalAlign: "middle",
        border: "0",
        paddingLeft: "50px"
    },
    PhotoContainer:{
        width:"63%",
    },
    PhotoContainerMedia:{
        width:"63%",
        alignSelf: "center"
    },
    PhotoWrapper:{
    objectFit: "contain",
    display: "flex",
    flexDirection: "row",
    width: "92.5%",
    maxWidth: "1100px",
    margin: "15px auto 50px", 
    },
    PhotoWrapperMedia: {
        objectFit: "contain",
        display: "flex",
        width: "100%",
        maxWidth: "1100px",
        margin: "15px auto 50px",
        
        flexDirection: "column",
        marginTop: "10px",
        height: "50%",
    },
    
    PhotoDescription:{
        width: "37%",
        padding: "15px 20px",
    },

    PhotoDescriptionMedia:{
    padding: "15px 20px",
    paddingRight: "10px",
    paddingLeft: "10px",
    width: "100%",
    },
    
    PhotoDescriptionH2:{
        fontSize: "35.1px",
        margin: "0",
        marginBottom: "35px",
        color: "#fff",
        lineHeight: "1.2",
        marginBlockStart:"0.83em",
        marginBlockEnd:" 0.83em",
        marginInlineStart: "0px",
        marginInlineEnd: "0px",
        display: "block",
    },
    PhotoDescriptionH2Media:{
        margin: "0",
        marginBottom: "10px",
        color: "#fff",
        lineHeight: "1.2",
        marginBlockStart:"0.83em",
        marginBlockEnd:" 0.83em",
        marginInlineStart: "0px",
        marginInlineEnd: "0px",
        display: "block",
        fontSize: "25px"
    }, 
    H5:{
        color: "#777",
        fontFamily: "inherit",
        display: "block",
        margin: "0",
        marginBottom: "20px",
        fontSize: "15px",
        lineHeight: "1.5",
        marginBlockStart: "1.67em",
        marginBlockEnd: "1.67em",
        marginInlineStart: "0px",
        marginInlineEnd: "0px", 
    },
    H5Media:{
        color: "#777",
        fontFamily: "inherit",
        display: "block",
        margin: "0",
        marginBottom: "5px",
        lineHeight: "1.5",
        marginBlockStart: "1.67em",
        marginBlockEnd: "1.67em",
        marginInlineStart: "0px",
        marginInlineEnd: "0px", 
        fontSize: "18px",
    },
     
    rightSide:{
        color: "#fff",
    },
});

