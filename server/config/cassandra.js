import cassandra from 'cassandra-driver';

const { CASSANDRA_CONTACT_POINTS, CASSANDRA_DATACENTER, CASSANDRA_KEYSPACE } = process.env;

if (!CASSANDRA_CONTACT_POINTS || !CASSANDRA_DATACENTER || !CASSANDRA_KEYSPACE) {
  console.warn('Cassandra: variáveis de ambiente não configuradas — conexão ignorada.');
}

const client = new cassandra.Client({
  contactPoints:   CASSANDRA_CONTACT_POINTS ? CASSANDRA_CONTACT_POINTS.split(',') : ['localhost'],
  localDataCenter: CASSANDRA_DATACENTER || 'datacenter1',
  keyspace:        CASSANDRA_KEYSPACE   || undefined
});

if (CASSANDRA_CONTACT_POINTS) {
  client.connect()
    .then(() => console.log('Cassandra conectado'))
    .catch(err => console.error('Erro Cassandra:', err.message));
}

export default client;