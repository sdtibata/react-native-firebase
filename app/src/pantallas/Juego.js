import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-2'.split('');
const MAX_FALLOS = 5;
const IMG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

export default function Juego() {
  const [pokemon, setPokemon] = useState(null);   // { id, nombre }
  const [usadas, setUsadas] = useState([]);
  const [fallos, setFallos] = useState(0);
  const [estado, setEstado] = useState('jugando'); // 'jugando' | 'gano' | 'perdio'
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);

  const uid = auth.currentUser.uid;
  const refUsuario = doc(db, 'usuarios', uid);

  // Al abrir: trae las estadísticas y el primer Pokémon
  useEffect(() => {
    const traerEstadisticas = async () => {
      const snap = await getDoc(refUsuario);
      if (snap.exists()) {
        setGanados(snap.data().ganados || 0);
        setPerdidos(snap.data().perdidos || 0);
      }
    };
    traerEstadisticas();
    nuevaPartida();
  }, []);

  const nuevaPartida = async () => {
    setPokemon(null);
    setUsadas([]);
    setFallos(0);
    setEstado('jugando');
    const id = Math.floor(Math.random() * 1025) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    setPokemon({ id, nombre: data.name.toUpperCase() });
  };

  const guardarResultado = async (gano) => {
    // increment suma en el servidor: no depende de lo que tenga la pantalla
    await updateDoc(refUsuario, gano ? { ganados: increment(1) } : { perdidos: increment(1) });
    // Historial de partidas: addDoc crea un documento con id automático
    await addDoc(collection(db, 'resultados'), {
      uid, pokemon: pokemon.nombre, gano, fecha: new Date().toISOString(),
    });
  };

  const tocarLetra = (letra) => {
    if (estado !== 'jugando' || usadas.includes(letra)) return;
    const nuevas = [...usadas, letra];
    setUsadas(nuevas);

    if (!pokemon.nombre.includes(letra)) {
      const f = fallos + 1;
      setFallos(f);
      if (f >= MAX_FALLOS) {
        setEstado('perdio');
        setPerdidos(perdidos + 1);
        guardarResultado(false);
      }
    } else if (pokemon.nombre.split('').every((l) => nuevas.includes(l))) {
      setEstado('gano');
      setGanados(ganados + 1);
      guardarResultado(true);
    }
  };

  if (!pokemon) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  const terminado = estado !== 'jugando';

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Adivina el Pokémon</Text>
      <Text>Ganados: {ganados} | Perdidos: {perdidos}</Text>
      <Image source={{ uri: `${IMG}${pokemon.id}.png` }} style={styles.imagen} />

      <View style={styles.fila}>
        {pokemon.nombre.split('').map((l, i) => (
          <Text key={i} style={styles.letra}>{usadas.includes(l) || terminado ? l : '_'}</Text>
        ))}
      </View>

      <View style={styles.teclado}>
        {LETRAS.map((l) => (
          <TouchableOpacity key={l} onPress={() => tocarLetra(l)}
            disabled={usadas.includes(l) || terminado}
            style={[styles.tecla, usadas.includes(l) && styles.teclaUsada]}>
            <Text>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Fallos: {fallos} / {MAX_FALLOS}</Text>
      {estado === 'perdio' && <Text style={styles.perdio}>¡Perdiste! Era {pokemon.nombre}</Text>}
      {estado === 'gano' && <Text style={styles.gano}>¡Ganaste!</Text>}
      {terminado && (
        <TouchableOpacity style={styles.boton} onPress={nuevaPartida}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Jugar otra vez</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 20, alignItems: 'center' },
  titulo: { fontSize: 24, marginBottom: 6 },
  imagen: { width: 150, height: 150, marginVertical: 10 },
  fila: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  letra: { fontSize: 28, marginHorizontal: 4 },
  teclado: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  tecla: { backgroundColor: '#eee', padding: 10, margin: 4, borderRadius: 4, width: 40, alignItems: 'center' },
  teclaUsada: { backgroundColor: '#ccc' },
  perdio: { color: 'red', fontSize: 18, marginTop: 8 },
  gano: { color: 'green', fontSize: 18, marginTop: 8 },
  boton: { marginTop: 10, padding: 10, backgroundColor: '#2563eb', borderRadius: 5 },
});
