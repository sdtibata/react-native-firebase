import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function Salir() {
  // Al abrir esta pestaña se cierra la sesión y App.js vuelve a Login
  useEffect(() => {
    signOut(auth);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
