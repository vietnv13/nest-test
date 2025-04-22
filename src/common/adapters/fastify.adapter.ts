import { FastifyAdapter } from '@nestjs/platform-fastify';

const fastifyAdapter: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
});
export { fastifyAdapter as fastifyApp };
