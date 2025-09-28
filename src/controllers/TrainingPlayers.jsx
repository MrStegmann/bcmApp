import { TrainingPlayersModel } from "../db/config";

export default {
  load: (setCallback) => {
    TrainingPlayersModel.getAll((teams) => {
      setCallback(teams);
    });
  },
  add: (training_id, player_id, notes, assistance, onSuccess) => {
    TrainingPlayersModel.create(
      { training_id, player_id, notes, assistance },
      onSuccess
    );
  },
  edit: (id, training_id, player_id, notes, assistance, onSuccess) => {
    TrainingPlayersModel.update(
      { id, training_id, player_id, notes, assistance },
      onSuccess
    );
  },
  remove: (id, onSuccess) => {
    TrainingPlayersModel.delete(id, onSuccess);
  },
};
