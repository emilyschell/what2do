// import React, { useEffect } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { styles, colors } from '../../../assets/styles';
// import { auth } from '../../firebase/firebase';
// import { onAuthStateChanged } from 'firebase/auth';

// const LoadingScreen = ({ navigation }) => {
//     useEffect(() => checkIfLoggedIn(), []);

//     const checkIfLoggedIn = () => {
//         const subscriber = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 //navigate to home screen
//                 navigation.navigate('OpenCreateMenu', {
//                     user: JSON.stringify(user),
//                 });
//             } else {
//                 //login screen
//                 navigation.navigate('LoginScreen');
//             }
//         });
//         return subscriber;
//     };

//     return (
//         <View style={styles.container}>
//             <ActivityIndicator size='large' color={colors.iconColor} />
//         </View>
//     );
// };

// export default LoadingScreen;
