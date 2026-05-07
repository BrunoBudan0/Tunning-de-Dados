import cassandra from 'cassandra-driver';
import 'dotenv/config';

const client = new cassandra.Client({
  contactPoints:   [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter:  process.env.CASSANDRA_DATACENTER,
  keyspace:         process.env.CASSANDRA_KEYSPACE
});

await client.connect()
  .then(() => console.log('Cassandra conectado'))
  .catch(err => console.error('Erro Cassandra:', err));

export default client;
