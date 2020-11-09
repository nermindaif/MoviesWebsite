import React,{ useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import { SearchBar, Image,Overlay   } from 'react-native-elements';
import axios from 'axios';
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

library.add(fas);
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

var searchQueriesArr=[]
var allSearchedMovies=[]
var showedMoviesCounterTemp=0
var currentMoviesToShowTemp=[]
export default function Search(){
    const [moviesData, setValueData]=useState([]);
    const[searchBar, setSearchBar]=useState('');
    const[currentMoviesToShow, setCurrentSearchedMovies]=useState([])
    const [flag, setValueFlag]=useState( false);
    const [found, setValueFound]=useState( true);
    const [temp, setValueTemp]=useState('none');
    const [nextBtn, setValueNextBtn]=useState('none');
    const [overviewBtn, setValueOveriew]=useState('none');
    const [overviewText, setValueOveriewText]=useState('');
    var foundTheMovie=false
    const [screenWidth, setWindowSize] = useState(undefined);
    useEffect(()=>{
        window.addEventListener('load', showSearchQueries());
            fetchMovies().then(response =>{
            setValueData(response.data.results)       
          });
        function handleResize() {
            setWindowSize(Math.round(Dimensions.get('window').width));
        }
        window.addEventListener("resize", handleResize); 
        handleResize()
      },[]);
    const { search } = searchBar;    
    function updateSearch(search){
        setSearchBar({ search });
    };
    function showSearchQueries(){
        setValueFlag(prevFlag => !prevFlag );
        if(flag==true){
            setValueTemp("block");
        }
        else{
            setValueTemp("none");
        }
    };
    function toggleSearch(search){
        setSearchBar({ search });
        getMovies(search);
    }
    function toggleMovies(){
        var arr=[]
        const cnt=showedMoviesCounterTemp
        const temp=allSearchedMovies.length-showedMoviesCounterTemp > 3 ? 3 : allSearchedMovies.length-showedMoviesCounterTemp
        var i=0
        console.log(showedMoviesCounterTemp)
        while(i<temp){
            arr.push(allSearchedMovies[i+cnt])
            showedMoviesCounterTemp++
            i++;
        }
        currentMoviesToShowTemp=arr
        setCurrentSearchedMovies(currentMoviesToShowTemp)
        console.log(currentMoviesToShow)
        if(showedMoviesCounterTemp==allSearchedMovies.length){
            setValueNextBtn('none')
        }
        else{
            setValueNextBtn('flex')
        }
    }
    function getMovies(search){
        if(searchBar==''){
            return
        }
        foundTheMovie=false;
        allSearchedMovies=[]
        for (var i=0; i<moviesData.length; i++){
            if(moviesData[i].original_title.toUpperCase().includes(search.toUpperCase())){
                allSearchedMovies.push(moviesData[i]);
                foundTheMovie=true
            }
        }
        if(foundTheMovie){
            setValueFound(true)
            const obj={"title":search}
            var put=true;
            for (var i=0; i<searchQueriesArr.length; i++){
                if(search.toUpperCase()==searchQueriesArr[i].title.toUpperCase() || search.toUpperCase()==''){
                    put=false
                    break;
                }
            }
            if(put){
                searchQueriesArr.unshift(obj)
            }
            if(searchQueriesArr.length==11){
                searchQueriesArr.pop()
            }
            showedMoviesCounterTemp=0
            currentMoviesToShowTemp=[]
            toggleMovies()
            console.log(currentMoviesToShow)
        }
        else{
            setValueFound(false)
            setValueNextBtn('none')
        }
    }
    function showOverview(e){
        setValueOveriew('block')
        setValueOveriewText(e)
    }
    function closeOverview(){
        setValueOveriew('none')
    }
    const ListOfMovies = ()=>{
        if(found){
            return <View style={styles.PhotosContainer}>
            <View style={Row}>
            {currentMoviesToShow.map(item=>
               <View style={Col}>
                        <View style={styles.PhotoContainer}>
                            <Link to={"/Movie/"+item.id}>
                                <View style={styles.BgImg}>
                                    <img style={styleImg} src= {"http://image.tmdb.org/t/p/w92/"+item.poster_path}/>
                                </View>
                            </Link> 
                            
                            <Text h3 style={styles.Title}>{item.original_title}</Text><br/>
                            <Text h3 style={styles.date}>Release Date: {item.release_date}</Text>
                            <View style={styleMedia.OverviewContainer}>
                                <Text h3 onPress={()=>showOverview(item.overview)} style={{textAlign:"center", fontSize:"8px",fontFamily:"inherite",cursor:"pointer", color:"white"}} >Overview</Text>
                            </View>
                        </View>
                </View>
            )}   
            </View>
          </View>
        }
    else{
        return <View style={{alignSelf:"center", color:"white", paddingTop:"10%"}}>This Movie Does Not Exist</View>
    }
}
const searchBarBtn = screenWidth > 767? styles.searchBarBtn: styles.searchBarBtnMedia
const overview = screenWidth > 767? styles.overview: styles.overviewMedia
const Row = screenWidth > 767? styles.Row: styles.RowMedia
const Col = screenWidth > 767? styles.Col: styles.ColMedia
const NextBtn = screenWidth > 767? styles.NextBtn: styles.NextBtnMedia 
    return (
        <View style={styles.Container}>
                <View style={styles.searchBar}>
                    <View style={styles.searchBarFeild}>
                        <SearchBar placeholder="Type Here..." onChangeText={updateSearch} value={search} onClick={showSearchQueries}/>
                        <View style={{display:temp}}>
                            <View style={styles.menu}>
                                {searchQueriesArr.map(item=>
                                    <View style={styles.menuItem}>
                                        <Text h5 style={styles.menuItemText} onPress={()=>toggleSearch(item.title)}>{item.title}</Text><br/>
                                    </View> 
                                )} 
                            </View>
                        </View>
                    </View>
                    <View style={searchBarBtn}>
                        <FontAwesomeIcon  onClick={()=>getMovies(search)} icon={['fas', 'search']}/>
                    </View>
                </View>
              
            <View style={styles.PhotosWrapper}>{ListOfMovies()}</View>
            <View style={{backgroundColor: '#181818',}}>
                <View style={{display:nextBtn}}>
                    <Text h5  style={NextBtn} onPress={toggleMovies}>
                        Next
                        <FontAwesomeIcon icon={['fas', 'angle-right']} className="nextIcon" color="white" style={{paddingTop:"2px",paddingLeft:"5px"}}/> 
                    </Text>
                </View>
            </View>
            <View style={{display:overviewBtn}}>
                <View style={styles.overlay} onClick={closeOverview}>
                    <Text h3 style={overview }>{overviewText}</Text> 
                </View>
            </View>
        </View>
      );  
  }
  const styleImg={ 
        width: "100%",
        height: "100%",
        display: "block",
        verticalAlign: "middle"
    }
  const styles = StyleSheet.create({
    overlay: {
        position: "fixed", 
        // display: "none", 
        width: "100%", 
        height: "100%", 
        top: "0",
        left: "0",  
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.5)", 
        zIndex: "3", 
        cursor: "pointer",
    },
    Title:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontWeight: "700",
        textAlign: "center",
        color: "white",
        fontSize: "10px",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "15.5px",
        webkitLineClamp: "2",
        webkitBoxient: "vertical",
        cursor: "default",
        fontSize: "15px",
        marginTop:"10px",
        display: "flex",
        alignSelf: "center"
    },
    date:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontWeight: "700",
        textAlign: "center",
        color: "white",
        fontSize: "8px",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "15px",
        webkitLineClamp: "2",
        webkitBoxient: "vertical",
        cursor: "default",
        height: "15px",
    },
    overview:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        textAlign: "center",
        // maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        webkitLineClamp: "2",
        webkitBoxient: "vertical",
        display:"flex",
        width: "50%",
        color:  "white",
        fontSize: "15px",
        alignSelf:"center",
        position: "fixed",
        top: "20%",
        backgroundColor:"#989898",
        opacity:"85%",
        borderRadius:"20px",
        padding:"7px"
    },
    overviewMedia:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        textAlign: "center",
        // maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        webkitLineClamp: "2",
        webkitBoxient: "vertical",
        display:"flex",
        // width: "50%",
        color:  "white",
        fontSize: "15px",
        alignSelf:"center",
        position: "fixed",
        top: "20%",
        backgroundColor:"#989898",
        opacity:"85%",
        borderRadius:"20px",
        padding:"7px"
    },
    OverviewContainer:{
        textDecoration: "none",
        color: "white",
        backgroundColor: '#181818',
    },
    PhotoContainer:{
        height: "auto",
        // margin: "0 auto",
        position: "relative",
        // marginBottom:"15px"
    },
    BgImg:{
        height: "200px",
        objectFit: "contain",
        backgroundSize: "cover !important",
        backgroundPosition: "center !important",
    },
    Col:{
        width:"30%",
        position: "relative",
        minHeight: "1px",
        marginTop: "20px",
        paddingLeft:"30px"
    },
    ColMedia:{
        width:"100%",
        position: "relative",
        minHeight: "1px",
        marginTop: "20px",
        paddingLeft:"30px"
    },
    Row:{
        margin: "0",
        flexDirection:"row",
        width:"50%",
    },
    RowMedia:{
        margin: "0",
        flexDirection:"column",
        width:"50%",
    },
    PhotosContainer:{
        width: "100%",
        alignItems: "center"
    },
    Container:{
        backgroundColor: '#181818',
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontWeight: '700',
        height: '100%',
    },
    menu: {
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        width: '100%',
        backgroundColor: '#777',
        color:  'black',
        position: 'absolute',
        zIndex: 1,
        opacity: '83%',
        
    },
    menuItem:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontSize:'20px',
        fontWeight: "bold",
        height:'25px',
        paddingLeft:'10px',
        cursor:'pointer',
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuItemText:{
        fontWeight:"700",
        paddingTop:"5px",
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
    },
    searchBar:{
        width: '95%',
        width: 'auto',
        flexDirection: 'row',
        zIndex: 1,
        // height:"10.5%",
        backgroundColor: "rgb(57, 62, 66)",
    },
    searchBarFeild:{
        width: '90%',
        justifyContent: 'flex-end'
    },
    searchBarBtn:{
        width: "10%" ,
        justifyContent: 'flex-end',
        fontSize:"50px",
        color: "rgb(48, 51, 55)",
        cursor: "pointer",
        borderBottom: "solid black",
        borderWidth: "1px",
        paddingLeft:"13px"
    },
    searchBarBtnMedia:{
        width: "10%" ,
        justifyContent: 'flex-end',
        fontSize:"20px",
        color: "rgb(48, 51, 55)",
        cursor: "pointer",
        borderBottom: "solid black",
        borderWidth: "1px",
        paddingLeft:"7px",
        paddingBottom:"16px"
    },
    PhotosWrapper:{ 
        width: "100%",
        justifyContent:"center",
        display: "flex",
        maxWidth:" 1100px",
            // margin: "30px auto 20px",
        zIndex: 0,
    },
    NextBtn:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontWeight: "bold",
        marginRight: "20px",
        marginBottom: "20px",
        color:"white",
        width: "100px",
        cursor: "pointer",
        display: "flex",
        alignSelf: "flex-end",
        position:"fixed",
        bottom:"0",
    },
    NextBtnMedia:{
        fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontWeight: "500",
        marginBottom: "20px",
        marginTop:"10px",
        color:"white",
        width: "65px",
        cursor: "pointer",
        display: "flex",
        alignSelf: "flex-end",
        position:"relative",
        bottom:"0",
    },
  });
  
  
  