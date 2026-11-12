import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import avisar from '../avisar';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser.uid;   // aquí siempre hay sesión
  const ref = doc(db, 'usuarios', uid);

  useEffect(() => {
    const traer = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setNombre(d.nombre || '');
        setFecha(d.fecha || '');
        setTelefono(d.telefono || '');
      }
      setCargando(false);
    };
    traer();
  }, []);

  const guardar = async () => {
    try {
      await updateDoc(ref, { nombre, fecha, telefono });
      avisar('Listo', 'Datos actualizados');
    } catch (error) {
      avisar('Error al actualizar', error.message);
    }
  };

  if (cargando) return <Text style={{ marginTop: 50, textAlign: 'center' }}>Cargando...</Text>;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mi perfil</Text>
      <Text style={{ marginBottom: 12 }}>{auth.currentUser.email}</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Fecha (AAAA-MM-DD)" value={fecha} onChangeText={setFecha} />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono}
        keyboardType="phone-pad" />
      <Button title="Guardar cambios" onPress={guardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 10 },
});
