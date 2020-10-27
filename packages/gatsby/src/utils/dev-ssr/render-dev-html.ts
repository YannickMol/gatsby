import JestWorker from "jest-worker"

const startWorker = (): any => {
  const newWorker = new JestWorker(require.resolve(`./render-dev-html-child`), {
    exposedMethods: [`renderHTML`],
    numWorkers: 1,
    enableWorkerThreads: true,
  })

  // jest-worker is lazy with forking but we want to fork immediately so the user
  // doesn't have to wait.
  // @ts-ignore
  newWorker.renderHTML({
    warming: true,
  })

  return newWorker
}

let worker
export const initDevWorkerPool = (): void => {
  worker = startWorker()
}

export const restartWorker = (): void => {
  const oldWorker = worker
  const newWorker = startWorker()
  worker = newWorker
  oldWorker.end()
}

export const renderDevHTML = ({
  path,
  htmlComponentRendererPath,
  directory,
}): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await worker.renderHTML({
        path,
        htmlComponentRendererPath,
        directory,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })