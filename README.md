# What2Do App

Capstone project for Ada Developers Academy cohort 17. A user-friendly task management tool for neurodiverse users.

## About the App

### Target Users

What2Do is designed for users on the Autism Spectrum or with other neurodifferences, who benefit from uncluttered, concrete visual references for what to expect, how to spend their time, steps for completing daily tasks, and progress toward a goal. The app is designed with the presence of a support person or caregiver in mind, but can equally be used independently by target users, or users could gradually grow from a read-only role to eventually making and maintaining their own schedules and goals.

### Schedules

The app can create, read, edit, delete and link visual checklists comprised of text, photos, or both. Photos can be uploaded from the user's image library or taken with the device camera. Schedules can be linked to sub-schedules to break down tasks into their composite steps and then navigate back to the parent schedule.

### Goals

The app can also create, read, edit, delete and maintain progress on token boards representing a measurable goal. Users can select from a small menu of pre-loaded token options, or upload a custom token using the device camera or image library.

### UI

The user interface is designed to be as user-friendly, undistracting and uncomplicated as possible. It has many user confirmation checks against accidentally deleting or losing data built in, and aims to be as oops-proof as possible. Although the app could be used by any age group, it is also specifically intended to fill the large gap in availability of non-juvenile learning materials for adults with neurodifferences. It presents as an adult productivity tool, but specifically tailored to the needs of learners on the spectrum, and with a simpler interface than most tools designed for neurotypical adults.

### Future Development

This is the first phase of a larger project concept that would integrate additional features. Full design concept can be found [here](https://www.figma.com/file/LaCgoyu2Dk6wV2suQgrf9p/What2Do?node-id=2%3A2). Feedback and suggestions from prospective users or support people are welcome and hugely helpful for future development of this tool.

## Demo

https://youtu.be/CwST9rXPrEM

## Try out on Android or iOS using Expo Go app

Download Expo app to your device and [click here](https://expo.dev/@lauraemilyschell/what2do) to access app.

## Dependencies

    "@expo/react-native-action-sheet": "^3.13.0",
    "@firebase/storage": "^0.9.9",
    "@react-native-community/checkbox": "^0.5.12",
    "@react-native-community/masked-view": "^0.1.11",
    "@react-navigation/drawer": "^6.4.3",
    "@react-navigation/native": "^6.0.11",
    "@react-navigation/stack": "^6.2.2",
    "base-64": "^1.0.0",
    "expo": "~45.0.0",
    "expo-camera": "^12.2.0",
    "expo-cli": "^6.0.1",
    "expo-font": "^10.1.0",
    "expo-image-manipulator": "~10.3.1",
    "expo-image-picker": "~13.1.1",
    "expo-permissions": "^13.2.0",
    "expo-status-bar": "~1.3.0",
    "firebase": "^9.9.1",
    "global": "^4.4.0",
    "react": "17.0.2",
    "react-dom": "17.0.2",
    "react-native": "0.68.2",
    "react-native-draggable-flatlist": "^3.1.2",
    "react-native-gesture-handler": "~2.2.1",
    "react-native-keyboard-aware-scroll-view": "^0.9.5",
    "react-native-reanimated": "2.8.0",
    "react-native-safe-area-context": "4.2.4",
    "react-native-screens": "~3.11.1",
    "react-native-web": "0.17.7"

## Installation

1. Clone this repository.
2. Install the Expo command line utility by running `npm install -g expo-cli`.
3. Install dependencies by running `yarn install`.
4. Download [Expo Client](https://apps.apple.com/us/app/expo-client/id982107779) if you would like to test it on a phone.
5. Or simply download [Andriod Studio](https://developer.android.com/studio) or [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) to have it running on an emulator/simulator on your laptop.
6. Start server by running `expo start`.
7. For testing on phone, scan the QR code that appears in the Expo metro bundler.

## Database

This project is currently registered with Firebase as a web app, so no further action needs to be taken to create a database. See the Google Firebase documentation for more information on how the app was registered.

In order to connect to Firebase, the file GoogleService-Info.plist (firebase config file) needs to be saved to the root of the project.

## Connect

What2Do is developed by [Ada Developers Academy](https://adadevelopersacademy.org/) cohort 17 student Emily Schell as a capstone project.<br>
I welcome feedback and questions about the app! Please visit http://emilyschell.me/ to reach out.
