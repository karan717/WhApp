import React from 'react'
import type {PropsWithChildren} from 'react';
import {
    SafeAreaView,
    ScrollView,
    TextInput,
    StyleSheet,
    Text,
    View,
    useColorScheme,
  } from 'react-native';
import {
DebugInstructions,
LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';
type SectionProps = PropsWithChildren<{
title: string;
}>;
  
function Section({children, title}: SectionProps): JSX.Element {

  
    return (
      <View className="mt-8 px-2">
        <Text className="text-2xl text-black dark:text-white">
          {title}
        </Text>
        <Text className="mt-2 text-lg text-black dark:text-white">
          {children}
        </Text>
      </View>
    );
  }  
const DraftPage = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [text, onChangeText] = React.useState('Username')
    const [text2, onChangeText2] = React.useState('Password')
    const backgroundStyle = "bg-neutral-300 dark:bg-slate-900"
  return (
          <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className={backgroundStyle}>
        <View className="bg-white dark:bg-black">
          <Section title="Wheelchair App, Step 1">
          First, the authentication should be implemented using
          database
          </Section>
          <Section title="Wheelchair App, Step 2">
            Add several pages with customized design.
          </Section>
          <TextInput style={styles.input}
            onChangeText={onChangeText}
            value = {text}/>
          <TextInput style={styles.input}
            onChangeText={onChangeText2}
            value = {text2}/>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  })

export default DraftPage