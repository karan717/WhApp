
<p align="center"><img width="500" src="./app/components/screens/auth/img/logo.png"></p>

<div align="center">


![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Visual Studio](https://img.shields.io/badge/Visual%20Studio-5C2D91.svg?style=for-the-badge&logo=visual-studio&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

</div>
<br><br>

# WhApp - The Wheelchair App !

WhApp is a mobile application designed to help wheelchair users have a hassle free experience to find public charging stations, navigate to the chosen station and charge the vehicle. The app aims to help users :

- **Easily locate accessible public charging stations.**

- **Plan optimal routes.**

- **View the statistics while charging.**

With a very user-friendly interface and intuitive design, the app provides real-time information about the location, availability, and accessibility of public charging stations in the user's area.<br><br>

# Content

<p align="center">
    |
    <a href="#homebrew-installation">Homebrew Installation</a>
  |
  <a href="#ruby-installation">Ruby Installation</a>
  |
  <a href="#react-native-installation">React-Native Installation</a>
  |
  <a href="#xcode-installation">XCode Installation</a>
  |
   <a href="#cocoapods-installation">Cocoapods Installation</a>
  |
  <a href="#running-the-app">Running the Application</a>
  |
  <a href="#sparkles-contributors">Meet the Team</a>
    |
  <a href="#email-support">Support</a>
  |
  
</p><br><br>

# Demo

<p align="center"><img width="700" src="./demo.gif"></p><br><br>

# Installations

## Homebrew Installation

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Ruby Installation

You'll have to setup the environment in an Apple device as you can develop ios applications only in an Apple device. As Apple devices come with a pre-insatalled version of Ruby which cannot be upgraded and used for development, we need to install Ruby separately for our development purposes. To install another version of Ruby, we will have to use a version manager which would basically help us switch between the versions when needed. To do so, perform the following steps:<br>
**Make sure you are in the base folder and run the following commands:**<br><br>


```bash
gpg2 --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

\curl -sSL https://get.rvm.io | bash -s stable

rvm install 2.7.6 --with-openssl-dir=/opt/homebrew/opt/openssl@1.1 --with-libyaml-dir=/opt/homebrew/opt/libyaml --with-opt-dir=/opt/homebrew/opt/libffi
```

<br>

### Trouble Shooting

In case you run into any issues running the above commands, refer https://rvm.io<br><br>

## React-Native Installation

To set up the React-Native environment, do:<br>

```bash
brew install node

brew install watchman

```

<br>

## XCode Installation

Next, download XCode from App Store. Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app. You will also need to install the Xcode Command Line Tools. Open Xcode, then choose Settings... (or Preferences...) from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

## Cocoapods Installation

Delete the podfile.lock from ios folder

```bash
sudo gem install cocoapods -v 1.11.3

bundle install

cd ios

pod cache clean --all               

pod install
```

<br>

### Trouble Shooting

In case you run into any issues running the above commands, refer https://reactnative.dev/docs/environment-setup<br><br>

# Running the Application

From the root directory, do:

```bash
npm install

npx react-native@latest start

i

```
OR 

In a new terminal, do:

```bash

npm run ios

```

# Meet the Team

**Dr. Zeljko Pantic**<br>
**Zhansen Akhmetov**<br>
**Shokoufeh**<br>
**Karan Kajani**<br>

# Support
