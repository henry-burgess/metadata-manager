// Custom types
import { ActivityModel, IActivity, ResponseMessage } from "@types";

// Utility functions and libraries
import { getIdentifier } from "../util";
import { getDatabase } from "../connectors/database";
import _ from "lodash";

// Models
import { Workspaces } from "./Workspaces";

// Collection name
const ACTIVITY_COLLECTION = "activity";

export class Activity {
  /**
   * Get all Activity entries from the Activity collection
   * @returns Collection of all Activity entries
   */
  static all = async (): Promise<ActivityModel[]> => {
    return await getDatabase()
      .collection<ActivityModel>(ACTIVITY_COLLECTION)
      .find()
      .toArray();
  };

  /**
   * Get multiple Activity entries (specified by ID) from the Activity collection
   * @param activities Collection of multiple Activity entries
   */
  static getMany = async (activities: string[]): Promise<ActivityModel[]> => {
    return await getDatabase()
      .collection<ActivityModel>(ACTIVITY_COLLECTION)
      .find({ _id: { $in: activities } })
      .toArray();
  };

  /**
   * Create a new Activity entry
   * @param activity Activity data
   * @param workspace Workspace identifier
   * @return {ResponseMessage}
   */
  static create = async (
    activity: IActivity,
    workspace: string,
  ): Promise<ResponseMessage> => {
    const activityModel: ActivityModel = {
      _id: getIdentifier("activity"),
      ...activity,
    };
    const response = await getDatabase()
      .collection<ActivityModel>(ACTIVITY_COLLECTION)
      .insertOne(activityModel);

    const successStatus = _.isEqual(response.insertedId, activityModel._id);
    if (successStatus) {
      // Add the Project to the Workspace
      await Workspaces.addActivity(workspace, response.insertedId);
    }

    return {
      success: successStatus,
      message: successStatus
        ? response.insertedId.toString()
        : "Unable to create Activity",
    };
  };
}
