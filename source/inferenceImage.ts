import { findClassById } from "@database/classData";
import * as tensorflow from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";

export type ClassificationProps = {
  probability: number;
  className: string;
};

export type AnalysisProps = {
  image?: string;
  specie: string;
  date: string;
  hour: string;
  user: string;
  id: number;
  probability: number;
};

export function getClassificationResults(
  predictionArray: number[],
): ClassificationProps[] {
  console.log("predictionArray", predictionArray);
  const allResults: ClassificationProps[] = predictionArray.map(
    (probability, index) => ({
      className: findClassById(index).className,
      probability,
    }),
  );

  const topResults = allResults.sort((a, b) => b.probability - a.probability);

  return topResults;
}

export async function imageClassification(
  imageUri: string,
  modelImage: tensorflow.LayersModel,
): Promise<ClassificationProps[]> {
  if (!modelImage) {
    console.log("Modelo ainda não carregado.");
    throw new Error("Modelo não carregado");
  }

  console.log("TensorFlow.js ready!");

  const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const imageBuffer = tensorflow.util.encodeString(
    imageBase64,
    "base64",
  ).buffer;
  const raw = new Uint8Array(imageBuffer);
  let imageTensor = decodeJpeg(raw); // shape [H, W, 3]

  const maxHeight = 480;
  const maxWidth = 640;

  // Redimensiona
  imageTensor = tensorflow.image.resizeBilinear(imageTensor, [
    maxHeight,
    maxWidth,
  ]);

  const pooled = tensorflow.tidy(() => {
    // Normaliza dividindo por 256 ANTES
    let normalized = imageTensor.toFloat().div(tensorflow.scalar(256.0));

    // Adiciona dimensão de batch [1,H,W,3]
    normalized = normalized.expandDims(0);

    // Faz o MaxPooling2D(pool_size=(2,2))
    return tensorflow.maxPool(
      normalized,
      [2, 2], // kernel
      [2, 2], // stride
      "valid", // padding
    );
  });

  // pooled já está pronto para predição
  const predictions = await modelImage.predict(pooled);
  // const predictionArray = await (predictions as tensorflow.Tensor).array();

  const predictionArray = await predictions.array();

  const topResults = getClassificationResults(predictionArray[0]);
  console.log(topResults);

  // Se não for mais usar `imageTensor`, descarte:
  imageTensor.dispose();

  return topResults;
}

export function createAnalysisData(
  result: {
    className: string;
    probability: number;
    imageUri?: string;
  },
  user: string = "Alexandre",
): AnalysisProps {
  return {
    specie: result.className,
    date: new Date().toLocaleDateString(),
    hour: new Date().toLocaleTimeString(),
    user,
    image: result.imageUri || null,
    probability: result.probability,
  };
}
