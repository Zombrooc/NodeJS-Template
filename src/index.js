const os = require("os");
const cluster = require("cluster");

const runPrimaryProcess = () => {
  const processesCount = os.cpus().length * 2;

  console.log(`Processo primário ${process.pid} está rodando...`);
  console.log(`Dividindo servidor com ${processesCount} processos \n`);

  for (let index = 0; index < processesCount; index++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} morreu... Subindo um novo!`);
      cluster.fork();
    }
  });
};

const runWorkerProcess = async () => {
  await import("./server.js");
};

cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess();
