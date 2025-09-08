const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

const connectElastic = async () => {
  try {
    const health = await client.cluster.health({});
    console.log('Elasticsearch cluster is running:', health.status);
  } catch (error) {
    console.error('Unable to connect to Elasticsearch:', error);
  }
};

module.exports = { client, connectElastic };