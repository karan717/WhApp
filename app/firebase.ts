import auth from '@react-native-firebase/auth'


export const register = (email: string, password: string) => 
auth().createUserWithEmailAndPassword( email, password)

export const login = (email: string, password: string) => 
auth().signInWithEmailAndPassword( email, password)

export const logout = () => auth().signOut()

