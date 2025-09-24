import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useClubStore } from "../store/ClubStore";
import TrainingForm from "../components/TrainingForm";
import TrainingDetail from "../components/TrainingDetail";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";
import DeleteModal from "../framework/DeleteModal";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useDB from "../hooks/useDB";

const TraningCards = ({ trainings, onSelect, onEdit, onDelete }) => {
  if (trainings.length === 0)
    return (
      <View className="w-full flex flex-col justify-center items-center mt-20">
        <MaterialCommunityIcons
          name="book-open-blank-variant-outline"
          size={30}
          color="gray"
        />
        <Text className="text-lg font-bold text-danish-light-gray px-16">
          Parece que no aún no has registrado ningún entrenamiento
        </Text>
      </View>
    );

  return (
    <View className="w-full h-full flex flex-col items-center">
      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
        {trainings.map((training) => (
          <TouchableOpacity
            key={training.id}
            onPress={() => onSelect(training)}
            className="my-2 active:shadow-inner shadow-danish-red bg-transparent z-10 hover:bg-danish-red active:bg-danish-red"
          >
            <View className="w-full flex flex-row justify-between px-4 py-3 bg-danish-dark-gray rounded-xl shadow-lg shadow-danish-red border border-danish-red">
              <View className="w-2/3 flex flex-col">
                <Text className="text-danish-white text-sm">
                  Sesión {training.training_number} - {training.date}
                </Text>
              </View>

              <View className="w-1/3 flex flex-row justify-end items-center gap-3">
                <TouchableOpacity color="blue" onPress={() => onEdit(training)}>
                  <Feather name="edit" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  color="white"
                  onPress={() => onDelete(training)}
                >
                  <Feather name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const TrainingList = ({ onReturn }) => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [createTraining, setCreateTraining] = useState(false);
  const [editTraining, setEditTraining] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { TrainingController } = useDB();

  const club = useClubStore((state) => state.club);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);

  useEffect(() => {
    getTrainings();
    setMainMenu();
  }, []);

  useEffect(() => {
    if (createTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setCreateTraining(false),
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [createTraining]);

  useEffect(() => {
    if (editTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => {
            (setSelectedTraining(null), setEditTraining(false));
          },
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [editTraining]);

  useEffect(() => {
    if (editTraining) return;
    if (selectedTraining) {
      setTopMenu([
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: () => setSelectedTraining(null),
          children: () => <Entypo name="back" size={18} color="white" />,
        },
      ]);
    } else {
      setMainMenu();
    }
  }, [selectedTraining]);

  const setMainMenu = () => {
    setTopMenu([
      {
        id: TopMenuEnums.ADD_NEW_SESSION,
        name: "Añadir Sesión",
        onPress: () => setCreateTraining(true),
        children: () => (
          <MaterialIcons name="assignment-add" size={18} color="white" />
        ),
      },
      {
        id: TopMenuEnums.GO_BACK,
        name: "Volver",
        onPress: onReturn,
        children: () => <Entypo name="back" size={18} color="white" />,
      },
    ]);
  };

  const getTrainings = async () => {
    TrainingController.load(club.id, setTrainings);
  };

  const handleAddTraining = async (data) => {
    TrainingController.add(data);
    getTrainings();
    setCreateTraining(false);
  };

  const handleUpdateTraining = async (data) => {
    TrainingController.edit(data);
    getTrainings();
    setSelectedTraining(null);
    setEditTraining(false);
  };

  const handleOpenEditForm = (item) => {
    setSelectedTraining(item);
    setEditTraining(true);
  };

  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    TrainingController.remove(itemToDelete.id);
    getTrainings();
    setModalVisible(false);
    setItemToDelete(null);
  };
  return (
    <View className="w-full h-full">
      <DeleteModal
        title={`¿Estás seguro de que quieres eliminar este entrenamiento ${itemToDelete?.training_number}?`}
        visible={modalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        item={itemToDelete}
      />

      {createTraining && !editTraining && (
        <TrainingForm
          onSubmit={handleAddTraining}
          onCancel={() => setCreateTraining(false)}
        />
      )}
      {!createTraining && editTraining && (
        <TrainingForm
          onSubmit={handleUpdateTraining}
          trainingData={selectedTraining}
          onCancel={() => setEditTraining(false)}
        />
      )}
      {!createTraining &&
        !editTraining &&
        (selectedTraining ? (
          <TrainingDetail
            data={selectedTraining}
            onReturn={() => setSelectedTraining(null)}
          />
        ) : (
          <TraningCards
            trainings={trainings}
            onSelect={setSelectedTraining}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteModal}
          />
        ))}
    </View>
  );
};

export default TrainingList;
