import { useState } from "react";
import { View, Text } from "react-native-web";
import CustomTooltip from "../../framework/CustomTooltip";

const GameStats = ({ players, quarters }) => {
  const totalRivalPoint = quarters.reduce(
    (accumulator, current) => accumulator + current.rivalResult,
    0,
  );
  const totalt2i = players.reduce(
    (accumulator, current) => accumulator + current.t2i,
    0,
  );
  const totalt3i = players.reduce(
    (accumulator, current) => accumulator + current.t3i,
    0,
  );
  const totalt1i = players.reduce(
    (accumulator, current) => accumulator + current.t1i,
    0,
  );
  const totalOreb = players.reduce(
    (accumulator, current) => accumulator + current.oreb,
    0,
  );
  const totalPer = players.reduce(
    (accumulator, current) => accumulator + current.per,
    0,
  );
  const totalt1a = players.reduce(
    (accumulator, current) => accumulator + current.t1a,
    0,
  );
  const totalt2a = players.reduce(
    (accumulator, current) => accumulator + current.t2a,
    0,
  );
  const totalt3a = players.reduce(
    (accumulator, current) => accumulator + current.t3a,
    0,
  );
  const totalasis = players.reduce(
    (accumulator, current) => accumulator + current.asis,
    0,
  );
  const calcPossessions = () => {
    return (
      0.96 *
      (totalt2i + totalt3i + 0.44 * totalt1i + totalPer - totalOreb)
    ).toFixed(2);
  };
  const calcOer = () => {
    const result =
      (possession / (totalt1a + totalt2a * 2 + totalt3a * 3)) * 100;
    if (isNaN(result)) return 0;
    return result.toFixed(2);
  };
  const calcDer = () => {
    const result = (totalRivalPoint / possession) * 100;
    if (isNaN(result) || !isFinite(result)) return 0;
    return result.toFixed(2);
  };
  const calceFG = () => {
    const result =
      100 * ((totalt2a + totalt3a + 0.5 * totalt3a) / (totalt2i + totalt3i));
    if (isNaN(result)) return 0;
    return result.toFixed(2);
  };

  const calcOrbPer = () => {
    const result =
      100 *
      (totalOreb /
        (totalt2i -
          totalt2a +
          (totalt3i - totalt3a) +
          0.44 * (totalt1i - totalt1a)));
    if (isNaN(result)) return 0;
    return result.toFixed(2);
  };

  const calcAst = () => {
    const result =
      100 * (totalasis / (totalt2i + totalt3i + 0.44 * totalt1i + totalPer));
    if (isNaN(result)) return 0;
    return result.toFixed(2);
  };

  const calcTov = () => {
    const result = 100 * (totalPer / possession);
    if (isNaN(result)) return 0;
    return result.toFixed(2);
  };

  const calcTlr = () => {
    const result = 100 * (totalt1a / (totalt2i + totalt3i));
    if (isNaN(result)) return 0;
    return result.toFixed(2);
  };

  const possession = calcPossessions();
  const oer = calcOer();
  const der = calcDer();
  const efg = calceFG();
  const orb = calcOrbPer();
  const ast = calcAst();
  const tov = calcTov();
  const tlr = calcTlr();

  const [visible, setVisible] = useState(false);

  return (
    <View className="w-1/3 flex flex-col gap-y-1">
      <CustomTooltip
        popover={
          <View>
            <Text className="text-white">
              El número estimado de posesiones que tuvo el equipo en el partido.
            </Text>
            <Text className="text-white">
              Un partido normal suele estar entre 65 y 75 posesiones por equipo.
            </Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>Posesiones</Text>
          <Text>{possession}</Text>
        </View>
      </CustomTooltip>

      <CustomTooltip
        popover={
          <View>
            <Text className="text-white font-bold">
              Ratio de Eficiencia Ofensiva
            </Text>
            <Text className="text-white">
              Puntos anotados por cada 100 posesiones.
            </Text>
            <Text className="text-white">Para referencia:</Text>
            <Text className="text-white">Malo: -90</Text>
            <Text className="text-white">Normal: 100</Text>
            <Text className="text-white">Muy bueno: 110-120</Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>OER</Text>
          <Text>{oer}</Text>
        </View>
      </CustomTooltip>
      <CustomTooltip
        popover={
          <View>
            <Text className="text-white font-bold">
              Ratio de Eficiencia Defensiva
            </Text>
            <Text className="text-white">
              Puntos que el rival anota por cada 100 posesiones. Cuanto más
              bajo, mejor defensa.
            </Text>
            <Text className="text-white">Para referencia:</Text>
            <Text className="text-white">Buena defensa: -100</Text>
            <Text className="text-white">Excelente: -95</Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>DER</Text>
          <Text>{der}</Text>
        </View>
      </CustomTooltip>
      <CustomTooltip
        popover={
          <View>
            <Text className="text-white font-bold">
              Tiros de campos Efectivos
            </Text>
            <Text className="text-white">
              Porcentaje de tiro ajustado que da más valor a los triples.
            </Text>
            <Text className="text-white">Para referencia:</Text>
            <Text className="text-white">Malo: -45%</Text>
            <Text className="text-white">Normal: 50%</Text>
            <Text className="text-white">Muy bueno: 55-60%</Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>eFG%</Text>
          <Text>{efg}</Text>
        </View>
      </CustomTooltip>
      <CustomTooltip
        popover={
          <View>
            <Text className="text-white font-bold">
              Porcentaje de rebotes ofensivos capturados sobre los disponibles.
            </Text>
            <Text className="text-white">
              Porcentaje de tiro ajustado que da más valor a los triples. Mide
              si el equipo genera segundas oportunidades.
            </Text>
            <Text className="text-white">Para referencia:</Text>
            <Text className="text-white">Normal: 25-30%</Text>
            <Text className="text-white">Bueno: +30%</Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>ORB%</Text>
          <Text>{orb}</Text>
        </View>
      </CustomTooltip>
      <CustomTooltip
        popover={
          <View>
            <Text className="text-white font-bold">
              Porcentaje de asistencias
            </Text>
            <Text className="text-white">
              Porcentaje de canastas anotadas asistidas.
            </Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>AST%</Text>
          <Text>{ast}</Text>
        </View>
      </CustomTooltip>

      <CustomTooltip
        popover={
          <View>
            <Text className="text-white">
              Porcentaje de posesiones que terminaron en pérdida.
            </Text>
            <Text className="text-white">Para referencia:</Text>
            <Text className="text-white">Normal: 12-15%</Text>
            <Text className="text-white">Malo: +20%</Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>TOV%</Text>
          <Text>{tov}</Text>
        </View>
      </CustomTooltip>
      <CustomTooltip
        popover={
          <View>
            <Text className="text-white">
              Frecuencia con la que el equipo va a la línea de tiros libres.
              Relación entre tiros libres intentados y tiros de campo.
            </Text>
            <Text className="text-white">Para referencia:</Text>
            <Text className="text-white">Alto: +35%</Text>
            <Text className="text-white">Normal: 25-35%</Text>
            <Text className="text-white">Bajo: -25%</Text>
          </View>
        }
      >
        <View className="w-full flex flex-row justify-between">
          <Text>TLR%</Text>
          <Text>{tlr}</Text>
        </View>
      </CustomTooltip>
    </View>
  );
};

export default GameStats;
