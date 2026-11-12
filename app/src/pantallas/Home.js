import { useEffect, useState } from 'react';
import { FlatList, Text, View, Image, StyleSheet } from 'react-native';

const IMG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

export default function Home() {
  const [pokemones, setPokemones] = useState([]);

  useEffect(() => {
    const traer = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
      const json = await res.json();
      // La url termina en /pokemon/25/: el número es el id
      setPokemones(json.results.map((p) => ({ ...p, id: p.url.split('/')[6] })));
    };
    traer();
  }, []);

  // FlatList solo dibuja lo que se ve en pantalla: con 1025 ítems es mucho
  // más liviana que un ScrollView con map
  return (
    <FlatList
      data={pokemones}
      keyExtractor={(p) => p.id}
      numColumns={2}
      contentContainerStyle={{ padding: 8 }}
      renderItem={({ item }) => (
        <View style={styles.tarjeta}>
          <Image source={{ uri: `${IMG}${item.id}.png` }} style={styles.imagen} />
          <Text>{item.id} - {item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tarjeta: { flex: 1, margin: 4, padding: 10, alignItems: 'center', backgroundColor: 'aliceblue', borderRadius: 8 },
  imagen: { width: 100, height: 100, resizeMode: 'contain' },
});
