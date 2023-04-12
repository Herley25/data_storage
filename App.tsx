import {
    useEffect,
    useState,
} from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
} from 'react-native';
import {
    MMKV,
    useMMKVString,
} from 'react-native-mmkv';

import {
    styles,
} from './styles';

// Criação de instância
const storage = new MMKV({ id: "datastorage" });

type User = {
  name: string;
  email: string;
};
export default function App() {
  const [name, setName] = useMMKVString("user.name");
  const [email, setEmail] = useMMKVString("user.email");

  const [user, setUser] = useState<User>();

  // Salvar informações
  const handleSave = () => {
    storage.set("user", JSON.stringify({ name, email }, null, 2));
  };

  // Buscar as informações salva no dispositivo
  const fetchUser = () => {
    const data = storage.getString("user");
    setUser(data ? JSON.parse(data) : {});
  };

  // listener para observar o que alterou
  useEffect(() => {
    const listner = storage.addOnValueChangedListener((changedKey) => {
      const newValue = storage.getString("user");

      console.log("Chave ->", changedKey);
      console.log("Novo valor ->", newValue);
    });

    return () => listner.remove();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nome..." style={styles.input} onChangeText={setName} value={name} />
      <TextInput
        placeholder="E-mail..."
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />

      <Button title="Salvar" onPress={handleSave} />

      <Text style={styles.text}>
        {user?.name} - {user?.email}
      </Text>
    </View>
  );
}
