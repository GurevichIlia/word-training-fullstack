import { FontAwesomeIcons } from '../enums/font-awesome';
import { GroupAction } from './../enums/group';
import { MenuItem } from './general.model';

export const groupMenuItems: MenuItem<GroupAction>[] = [
  new MenuItem('Create group', GroupAction.NEW_GROUP, FontAwesomeIcons.Create),
  new MenuItem('Edit group', GroupAction.EDIT_GROUP, FontAwesomeIcons.Edit),
  new MenuItem('Add words', GroupAction.ADD_WORDS, FontAwesomeIcons.Add),
  new MenuItem('Delete group', GroupAction.DELETE_GROUP, FontAwesomeIcons.Delete),

];

export interface GroupMenuItem extends MenuItem<GroupAction> {
  action: GroupAction;
}
