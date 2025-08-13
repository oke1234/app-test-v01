import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Modal,
  Animated,
  FlatList,
  Pressable,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function GroupPeople({ setCurrentPage, archived = false, items, setItems }) {
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const ellipsisRefs = useRef({});
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filters
  const currentGroups = items.filter(
    (i) => i.type === 'group' && i.status === (archived ? 'archived' : 'active')
  );
  const currentPeople = items.filter(
    (i) =>
      i.type === 'person' && i.status === (archived ? 'archived' : 'active')
  );

  const moveItem = (pageName, newStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.page === pageName ? { ...item, status: newStatus } : item
      )
    );
  };

  const deleteItem = (pageName) => {
    let deleted = null;
    setItems((prev) => {
      const updated = prev.filter((item) => {
        if (item.page === pageName) {
          deleted = { ...item, status: 'suggestion' };
          return false;
        }
        return true;
      });
      return deleted ? [deleted, ...updated] : updated;
    });
    closeMenu();
  };

  const openMenu = (page) => {
    ellipsisRefs.current[page]?.measureInWindow((x, y, width, height) => {
      setDropdownPosition({ x, y: y + height });
      setOpenMenuFor(page);
    });
  };

  const closeMenu = () => setOpenMenuFor(null);

  return (
    <>
      {currentGroups.map((group) => (
        <TouchableOpacity
          key={group.page}
          onPress={() => {
            setCurrentPage(group.page);
            closeMenu();
          }}>
          <View style={styles.textbox1}>
            <Ionicons name="people" size={24} color="grey" />
            <Text style={styles.box1text}>{group.name}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                ref={(ref) => (ellipsisRefs.current[group.page] = ref)}
                onPress={() => openMenu(group.page)}>
                <Ionicons name="ellipsis-horizontal" size={20} color="grey" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.dashedLine} />

      {currentPeople.map((person) => (
        <TouchableOpacity
          key={person.page}
          onPress={() => {
            setCurrentPage(person.page);
            closeMenu();
          }}>
          <View style={styles.textbox1}>
            <Ionicons
              name={person.icon || 'person-circle'}
              size={24}
              color="grey"
            />
            <Text style={styles.box1text}>{person.name}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                ref={(ref) => (ellipsisRefs.current[person.page] = ref)}
                onPress={() => openMenu(person.page)}>
                <Ionicons name="ellipsis-horizontal" size={20} color="grey" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {confirmDelete && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ marginBottom: 15 }}>Are you sure?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => setConfirmDelete(false)}
                style={styles.modalButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteItem(itemToDelete);
                  setConfirmDelete(false);
                  setItemToDelete(null);
                }}
                style={[styles.modalButton, { backgroundColor: 'red' }]}>
                <Text style={{ color: 'white' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Modal transparent visible={!!openMenuFor} onRequestClose={closeMenu}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={closeMenu}>
          <View
            style={[
              styles.dropdown,
              {
                position: 'absolute',
                top: dropdownPosition.y,
                left: dropdownPosition.x - 70,
                maxWidth: 110,
                elevation: 10,
                zIndex: 100,
              },
            ]}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setItemToDelete(openMenuFor);
                closeMenu();
                setConfirmDelete(true);
              }}>
              <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                moveItem(openMenuFor, archived ? 'active' : 'archived');
                closeMenu();
              }}>
              <Text style={styles.text}>
                {archived ? 'Unarchive' : 'Archive'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const PageWithBack = ({ currentPage, pageName, setCurrentPage, title }) => {
  if (currentPage !== pageName) return null;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Fixed top row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <TouchableOpacity onPress={() => setCurrentPage('people')}>
          <Text style={{ fontSize: 24, marginRight: 10, color: '#2772BC' }}>
            {'<'}
          </Text>
        </TouchableOpacity>

        <Ionicons
          name="person-circle"
          size={30}
          color={currentPage === 'profile' ? '#2772BC' : 'grey'}
        />

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
          {title} {/* Show group name here */}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ height: 470 }}>
          <ScrollView
            style={{ flex: 1, backgroundColor: 'lightgrey', borderRadius: 10 }}
            contentContainerStyle={{ padding: 20 }}>
            <Text>Scrollable content here. Add enough to scroll...</Text>
          </ScrollView>
        </View>
      </View>

      {/* Fixed input at bottom */}
      <View
        style={{
          position: 'absolute',
          bottom: -280,
          left: 20,
          right: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextInput
          placeholder="Shoot a text"
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            paddingHorizontal: 10,
            backgroundColor: 'white',
          }}
        />
        <Ionicons
          name="send"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </View>
    </View>
  );
};

export function ExpandableGroup({ item, onAdd, onToggle, expanded }) {
  const { name, bio, type } = item;
  const isPerson = type === 'person';

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: expanded ? 230 : 60,
        justifyContent: 'flex-start',
        marginBottom: 6,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 30 }}>
        <Ionicons
          name={isPerson ? 'person-circle' : 'people'}
          size={30}
          color="black"
        />
        <Text style={{ marginLeft: 10, fontSize: 18 }}>{name}</Text>

        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}>
          <TouchableOpacity onPress={() => onAdd(item)}>
            <Ionicons name="add-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <>
          <View
            style={{
              height: 120,
              paddingHorizontal: 10,
              backgroundColor: 'white',
              borderRadius: 8,
              marginTop: 10,
              justifyContent: 'center',
            }}
          />
          <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
            <Text>{bio || (isPerson ? 'No bio available' : '')}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

function TaskItem({
  text,
  checked,
  onToggle,
  onDelete,
  subtitle,
  subtasks,
  onPress,
  onToggleSubtask,
  onDeleteSubtask,
  onPressSubtask,
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={onPress} style={styles.taskRow}>
        <TouchableOpacity onPress={onToggle} style={{ marginRight: 10 }}>
          <View style={styles.squareBox}>
            {checked && <Ionicons name="checkmark" size={20} color="grey" />}
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.taskText, checked && styles.strikedText]}>
            {text}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitleText, checked && styles.strikedText]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {subtasks?.length > 0 && (
        <View style={{ marginLeft: 33, marginTop: 8 }}>
          {subtasks.map((sub, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start', // changed to flex-start for desc multiline
                marginBottom: 6,
              }}>
              <TouchableOpacity
                onPress={() => onToggleSubtask(idx)}
                style={styles.subtaskBox}>
                {(checked || sub.checked) && (
                  <Ionicons name="checkmark" size={14} color="grey" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onPressSubtask(idx)}
                style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.subtaskText,
                    (checked || sub.checked) && styles.strikedText,
                    { marginLeft: 10 },
                  ]}>
                  {sub.text}
                </Text>

                {sub.desc ? (
                  <Text
                    style={[
                      styles.subtitleText,
                      (checked || sub.checked) && styles.strikedText,
                      { marginLeft: 10, marginTop: 2 },
                    ]}>
                    {sub.desc}
                  </Text>
                ) : null}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ArchivedBar({ setCurrentPage }) {
  return (
    <TouchableOpacity onPress={() => setCurrentPage('archived')}>
      <View style={styles.archiveBox}>
        <Ionicons name="archive" size={24} color="grey" />
        <Text style={styles.archiveText}>Archived</Text>
      </View>
    </TouchableOpacity>
  );
}

export function ExpandableBlock({
  goalTitle,
  streakNumber,
  Currentstreak,
  longeststreak,
  consistency,
  workoutCompleted,
  expanded,
  onPress,
  onDeleteGoal,
}) {
  const animation = useMemo(() => new Animated.Value(0), []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dropdownStyle = {
    position: 'absolute',
    top: 42, // right below the button
    right: 20, // aligned to the right edge
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'flex-start', // left align text inside dropdown
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [expanded, animation]);

  useEffect(() => {
    if (!expanded) {
      setShowDropdown(false);
      setConfirmDelete(false);
    }
  }, [expanded]);

  return (
    <View style={{ position: 'relative' }}>
      {/* Dropdown (outside touchable) */}
      {showDropdown && !confirmDelete && (
        <View style={dropdownStyle}>
          <TouchableOpacity
            onPress={() => setConfirmDelete(true)}
            style={{ padding: 10 }}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {confirmDelete && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ marginBottom: 15 }}>Are you sure?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmDelete(false);
                  setShowDropdown(false);
                }}
                style={styles.modalButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onDeleteGoal();
                  setConfirmDelete(false);
                  setShowDropdown(false);
                }}
                style={[styles.modalButton, { backgroundColor: 'red' }]}>
                <Text style={{ color: 'white' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            padding: 20,
            marginBottom: 10,
            backgroundColor: '#eee',
            borderRadius: 10,
            height: expanded ? 350 : 260,
            justifyContent: 'flex-start',
          }}>
          {/* Header: title + right icon */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
              {goalTitle}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {expanded ? (
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                </TouchableOpacity>
              ) : (
                <>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {streakNumber}
                  </Text>
                  <Ionicons name="flame" size={20} color="#DB4A2B" />
                </>
              )}
            </View>
          </View>

          {/* Stats when expanded */}
          {expanded && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Text style={{ marginTop: 5 }}>Current streak:</Text>
                <Text style={{ marginTop: 5 }}>Longest streak:</Text>
                <Text style={{ marginTop: 10 }}>Consistency:</Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Text style={{ marginTop: 5 }}>{Currentstreak}</Text>
                <Text style={{ marginTop: 5 }}>{longeststreak}</Text>
                <Text style={{ marginTop: 10 }}>{consistency}</Text>
              </View>
            </View>
          )}

          {/* Days row */}
          <View
            style={{
              flexDirection: 'row',
              width: 280,
              alignSelf: 'flex-start',
              flexWrap: 'wrap',
              marginTop: 7,
              marginLeft: -4,
              marginBottom: 2,
            }}>
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
              <View
                key={i}
                style={{
                  width: 30,
                  alignItems: 'center',
                  marginHorizontal: 4,
                }}>
                <Text
                  style={{ fontSize: 12, fontWeight: 'bold', color: 'grey' }}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Circles */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: 280,
              alignSelf: 'flex-start',
              marginTop: 0,
              marginLeft: -4,
            }}>
            {(() => {
              const year = new Date().getFullYear();
              const month = new Date().getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDayWeekDay =
                (new Date(year, month, 1).getDay() + 6) % 7;
              const daysInPrevMonth = new Date(year, month, 0).getDate();
              const totalCells = 35;

              let dayItems = [];

              for (let i = 0; i < totalCells; i++) {
                let day = null;
                let isCurrentMonth = true;

                if (i < firstDayWeekDay) {
                  day = daysInPrevMonth - firstDayWeekDay + 1 + i;
                  isCurrentMonth = false;
                } else if (i >= firstDayWeekDay + daysInMonth) {
                  day = i - (firstDayWeekDay + daysInMonth) + 1;
                  isCurrentMonth = false;
                } else {
                  day = i - firstDayWeekDay + 1;
                }

                const today = new Date();
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear() &&
                  isCurrentMonth;

                const isChecked = isToday && workoutCompleted;

                dayItems.push(
                  <View
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: 'lightgrey',
                      marginHorizontal: 3,
                      marginVertical: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isCurrentMonth ? 1 : 0.3,
                    }}>
                    <View
                      style={{
                        width: 23.5,
                        height: 23.5,
                        borderRadius: 11.75,
                        backgroundColor: isChecked ? 'lightgreen' : 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: 'grey',
                          position: 'absolute',
                          opacity: isChecked ? 0.4 : 1,
                        }}>
                        {day}
                      </Text>
                      {isChecked && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color="darkgreen"
                        />
                      )}
                    </View>
                  </View>
                );
              }

              return dayItems;
            })()}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function calculateStreaks(dates) {
  if (!dates.length)
    return { currentStreak: 0, longestStreak: 0, consistency: '0%' };

  // Sort dates ascending
  const sorted = dates.slice().sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) current++;
    else current = 1;

    if (current > longest) longest = current;
  }

  // Check if last date is today or yesterday for current streak
  const lastDate = new Date(sorted[sorted.length - 1]);
  const today = new Date();
  const diffLastToday = (today - lastDate) / (1000 * 60 * 60 * 24);

  if (diffLastToday > 1) current = 0; // streak broken

  // Consistency = (days checked / total days passed) * 100%
  const firstDate = new Date(sorted[0]);
  const totalDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const consistencyPercent = Math.round((dates.length / totalDays) * 100);

  return {
    currentStreak: current,
    longestStreak: longest,
    consistency: consistencyPercent + '%',
  };
}

export default function App() {
  const [tasks, setTasks] = useState([
    {
      text: 'Goal - Workout',
      desc: 'Go till you drop down',
      subtasks: [
        { text: 'Pushups', desc: 'Do 3 sets', checked: false },
        { text: 'Pullups', desc: 'Minimum 5', checked: false },
      ],
    },
    { text: 'Do the dishes', desc: '', subtasks: [] },
  ]);

  const [checkedStates, setCheckedStates] = useState(
    Array(tasks.length).fill(false)
  );
  const [doneTasks, setDoneTasks] = useState([]);
  const [doneCollapsed, setDoneCollapsed] = useState(true);

  // States en functies voor subtaken bewerken
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [editedSubtaskText, setEditedSubtaskText] = useState('');
  const [editedSubtaskDesc, setEditedSubtaskDesc] = useState('');
  const [showSubtaskDropdown, setShowSubtaskDropdown] = useState(false);

  const saveSubtaskInline = () => {
    if (!selectedSubtask) return;
    const updated = [...tasks];
    const { taskIdx, subIdx } = selectedSubtask;
    updated[taskIdx].subtasks[subIdx].text = editedSubtaskText;
    updated[taskIdx].subtasks[subIdx].desc = editedSubtaskDesc;
    setTasks(updated);
  };

  const updateSubtaskChecked = (taskIdx, subIdx) => {
    const updated = [...tasks];
    updated[taskIdx].subtasks[subIdx].checked =
      !updated[taskIdx].subtasks[subIdx].checked;
    setTasks(updated);
  };

  const deleteSubtask = (taskIdx, subIdx) => {
    const updated = [...tasks];
    updated[taskIdx].subtasks.splice(subIdx, 1);
    setTasks(updated);
  };

  // Taken toevoegen en verwijderen
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleAddSuggestionTask = (taskText) => {
    if (taskText.trim()) {
      setTasks([{ text: taskText, desc: '', subtasks: [] }, ...tasks]);
      setCheckedStates([false, ...checkedStates]);
      setNewTaskText('');
      setIsAddingTask(false);
      setFilteredSuggestions([]);
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      setTasks([
        { text: newTaskText, desc: newTaskDesc, subtasks: [] },
        ...tasks,
      ]);
      setCheckedStates([false, ...checkedStates]);
      setNewTaskText('');
      setNewTaskDesc('');
      setAddingTask(false);
    }
  };

  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    const newChecks = checkedStates.filter((_, i) => i !== index);
    setTasks(newTasks);
    setCheckedStates(newChecks);
    setSelectedTask(null);
    setCurrentPage('home');
  };

  // Taken afvinken en ongedaan maken
  const toggleCheckTask = (index) => {
    const taskToMove = tasks[index];
    const today = new Date().toISOString().split('T')[0];

    if (taskToMove.text.startsWith('Goal -')) {
      const goalTitle = taskToMove.text.replace('Goal - ', '');
      setGoalDates((prev) => {
        const updated = [...(prev[taskToMove.text] || [])];
        if (!updated.includes(today)) updated.push(today);
        const { currentStreak, longestStreak, consistency } =
          calculateStreaks(updated);

        setGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal.title === goalTitle
              ? {
                  ...goal,
                  streakNumber: currentStreak,
                  Currentstreak: `${currentStreak} days`,
                  longeststreak: `${longestStreak} days`,
                  consistency,
                  workoutCompleted: true,
                }
              : goal
          )
        );
        return { ...prev, [taskToMove.text]: updated };
      });
    }

    if (doneTasks.includes(taskToMove)) {
      // ongedaan maken
      setWorkoutCompleted(false);
      setTasks([...tasks, taskToMove]);
      setCheckedStates([...checkedStates, false]);
      setDoneTasks(doneTasks.filter((t) => t !== taskToMove));
    } else {
      // afvinken
      if (taskToMove.text === 'Goal - Workout') setWorkoutCompleted(true);
      setDoneTasks([...doneTasks, taskToMove]);
      setTasks(tasks.filter((_, i) => i !== index));
      setCheckedStates(checkedStates.filter((_, i) => i !== index));
    }
  };

  const toggleUncheckDoneTask = (index) => {
    const taskToRestore = doneTasks[index];
    const today = new Date().toISOString().split('T')[0];

    if (taskToRestore.text.startsWith('Goal -')) {
      const goalTitle = taskToRestore.text.replace('Goal - ', '');
      setGoalDates((prev) => {
        const updated = (prev[taskToRestore.text] || []).filter(
          (d) => d !== today
        );
        const { currentStreak, longestStreak, consistency } =
          calculateStreaks(updated);

        setGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal.title === goalTitle
              ? {
                  ...goal,
                  streakNumber: currentStreak,
                  Currentstreak: `${currentStreak} days`,
                  longeststreak: `${longestStreak} days`,
                  consistency,
                  workoutCompleted: false,
                }
              : goal
          )
        );
        return { ...prev, [taskToRestore.text]: updated };
      });
    }

    if (taskToRestore.text === 'Goal - Workout') {
      setWorkoutCompleted(false);
    }

    setTasks([...tasks, taskToRestore]);
    setCheckedStates([...checkedStates, false]);
    setDoneTasks(doneTasks.filter((_, i) => i !== index));
  };

  // Groepen en mensen beheren

  const createUniquePageId = () =>
    `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const handleAdd = (item) => {
    const newPage = createUniquePageId();
    const newItem = {
      page: newPage,
      name: item.name || (item.isPerson ? 'New Person' : 'New Group'),
      bio: item.bio || '',
      type: item.isPerson ? 'person' : 'group',
      status: 'active',
      icon: item.isPerson ? 'person-circle' : 'people',
      useMaterial: false,
      isPerson: item.isPerson,
    };

    setItems((prev) => [newItem, ...prev]);
    setSuggestions((prev) => prev.filter((s) => s.name !== newItem.name));
    setPeoplePages((prev) => [...prev, newPage]);
    setCurrentPage(newPage);
  };

  const [items, setItems] = React.useState([
    {
      name: 'Gymboys',
      page: 'gymboys',
      bio: 'Workout crew',
      type: 'group',
      status: 'active',
    },
    {
      name: 'Jake',
      page: 'jake',
      bio: 'Cool guy',
      type: 'person',
      status: 'active',
    },
    {
      name: 'Foodies',
      page: 'foodies',
      bio: 'Loves food',
      type: 'group',
      status: 'suggestion',
    },
    {
      name: 'Henk',
      page: 'henkies',
      bio: 'loves moving',
      type: 'person',
      status: 'suggestion',
    },
    { 
      name: 'Gerda',
      page: 'Gerda',
      bio: 'he is my favorite person',
      type: 'person',
      status: 'active',
    },
  ]);

  const [peoplePages, setPeoplePages] = useState([
    'people',
    'archived',
    'gymboys',
    'travelgang',
    'futureyou',
    'jake',
    'addpeople',
  ]);

  // Filters for each "page"
  const people = items.filter(
    (i) => i.type === 'person' && i.status === 'active'
  );
  const groups = items.filter(
    (i) => i.type === 'group' && i.status === 'active'
  );
  const archivedGroups = items.filter(
    (i) => i.type === 'group' && i.status === 'archived'
  );
  const archivedPeople = items.filter(
    (i) => i.type === 'person' && i.status === 'archived'
  );
  const suggestions = items.filter((i) => i.status === 'suggestion');

  // Move item to a new status (works for anything)
  const moveItem = (pageName, newStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.page === pageName ? { ...item, status: newStatus } : item
      )
    );
  };

  // Example usage:
  // moveItem('jake', 'suggestion'); // Moves Jake to suggestions
  // moveItem('gymboys', 'archived'); // Moves Gymboys to archived

  const [search, setSearch] = useState('');

  const filteredList = items.filter(
    (item) =>
      item.status === 'suggestion' &&
      (item.name || item.title || '')
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Overige states
  const [expandedTitle, setExpandedTitle] = useState(null);
  const [expandedGoalIndex, setExpandedGoalIndex] = useState(null);
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [subtaskFromTaskModal, setSubtaskFromTaskModal] = useState(false);

  const [currentPage, setCurrentPage] = useState('home');
  const [goalDates, setGoalDates] = useState({});
  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    longestStreak: 0,
    consistency: '0%',
  });

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const [goals, setGoals] = useState([
    {
      title: 'Workout',
      streakNumber: streaks.currentStreak,
      Currentstreak: `${streaks.currentStreak} days`,
      longeststreak: `${streaks.longestStreak} days`,
      consistency: streaks.consistency,
      workoutCompleted: workoutCompleted,
    },
  ]);

  // UI helpers
  function onToggle(title) {
    setExpandedTitle((prev) => (prev === title ? null : title));
  }

  const handleGoalPress = (index) => {
    setExpandedGoalIndex(expandedGoalIndex === index ? null : index);
  };

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (newTaskText.trim() === '') {
        setIsAddingTask(false);
        setFilteredSuggestions([]);
      }
    });

    return () => keyboardHideListener.remove();
  }, [newTaskText]);

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.contentWrapper}>
        <TouchableOpacity onPress={() => setCurrentPage('profile')}>
          <Ionicons
            name="person-circle"
            size={60}
            color={currentPage === 'profile' ? '#2772BC' : 'grey'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentPage === 'profile') {
              setCurrentPage('help');
            } else if (currentPage === 'home') {
              setIsAddingTask(true); // add task on home
            } else if (currentPage === 'people') {
              setCurrentPage('addpeople'); // go to targetSuggestion page from people
            } else if (currentPage === 'target') {
              setCurrentPage('addGoal');
            } else if (currentPage === 'editTask') {
              setShowAddSubtask(true);
              setShowDropdown(false);
            }
          }}>
          <Ionicons
            name={
              currentPage === 'profile' || currentPage === 'help'
                ? 'information-circle'
                : 'add-circle'
            }
            size={60}
            color={currentPage === 'help' ? '#2772Bc' : 'grey'}
          />
        </TouchableOpacity>
      </View>

      {currentPage === 'addpeople' && (
        <View style={{ padding: 20 }}>
          {/* Top bar with back arrow */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <TouchableOpacity onPress={() => setCurrentPage('people')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, marginLeft: 10 }}>Add People</Text>
          </View>

          {/* Search bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              height: 40,
              marginBottom: 15,
            }}>
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              style={{
                flex: 1,
                borderWidth: 0, // geen extra border bij focus
                outlineStyle: 'none', // 🔥 verwijdert zwarte rand in web preview/Expo Go
              }}
            />
            <Ionicons name="search" size={20} color="grey" />
          </View>

          {/* Content: Search results OR Suggested */}
          {search.length > 0 ? (
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredList.map((item, i) => (
                <ExpandableGroup
                  key={item.page}
                  item={item}
                  onAdd={(it) => moveItem(it.page, 'active')}
                  expanded={expandedTitle === item.page}
                  onToggle={() => onToggle(item.page)}
                />
              ))}
            </ScrollView>
          ) : (
            <>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>Suggested:</Text>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ height: 2000 }}>
                {suggestions.map((item, i) => (
                  <ExpandableGroup
                    key={item.page}
                    item={item}
                    onAdd={(it) => moveItem(it.page, 'active')}
                    expanded={expandedTitle === item.page}
                    onToggle={() => onToggle(item.page)}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      )}

      {currentPage === 'help' && (
        <View style={{ flex: 1, padding: 20 }}>
          {/* Help Icon and Title */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 30,
            }}>
            <Ionicons name="information-circle" size={80} color="#2772BC" />
            <View style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Help</Text>
              <Text style={{ fontSize: 14, color: '#555' }}>
                How to use the app effectively
              </Text>
            </View>
          </View>

          <View style={{ height: 500, zIndex: 0 }}>
            {/* Scrollable Help Sections */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  height: 100,
                  backgroundColor: '#DB4A2B',
                  borderRadius: 10,
                  marginBottom: 15,
                  padding: 15,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Tasks
                </Text>
                <Text style={{ color: 'white', marginTop: 5 }}>
                  Create tasks on the main screen. Tap to add details or
                  subtasks.
                </Text>
              </View>

              <View
                style={{
                  height: 100,
                  backgroundColor: '#2772BC',
                  borderRadius: 10,
                  padding: 15,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Navigation
                </Text>
                <Text style={{ color: 'white', marginTop: 5 }}>
                  Use the menu to switch pages. Archived tasks are under
                  "Archived".
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {[...groups, ...people].map((item) => (
        <PageWithBack
          key={item.page}
          currentPage={currentPage}
          pageName={item.page}
          setCurrentPage={setCurrentPage}
          title={item.name}
          icon={
            item.useMaterial ? (
              <MaterialCommunityIcons name={item.icon} size={24} color="grey" />
            ) : (
              <Ionicons name={item.icon} size={24} color="grey" />
            )
          }
        />
      ))}

      {currentPage === 'archived' && (
        <>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <TouchableOpacity onPress={() => setCurrentPage('people')}>
              <Ionicons name="chevron-back" size={24} color="#2772BC" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
              Archived
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.boxscroll}>
            <GroupPeople
              setCurrentPage={setCurrentPage}
              archived={true}
              groups={groups}
              people={people}
              archivedGroups={archivedGroups}
              archivedPeople={archivedPeople}
              handleAdd={handleAdd}
              items={items} // <-- pass items here
              setItems={setItems}
            />
          </ScrollView>
        </>
      )}

      <ScrollView
        style={styles.taskList}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {currentPage === 'target' && (
          <View>
            {goals.map((goal, index) => (
              <ExpandableBlock
                key={index}
                goalTitle={goal.title}
                streakNumber={goal.streakNumber}
                Currentstreak={goal.Currentstreak}
                longeststreak={goal.longeststreak}
                consistency={goal.consistency}
                workoutCompleted={goal.workoutCompleted}
                expanded={expandedGoalIndex === index}
                onPress={() => handleGoalPress(index)}
                onDeleteGoal={() => handleDeleteGoal(index)}
              />
            ))}
          </View>
        )}

        {currentPage === 'people' && (
          <>
            <ArchivedBar setCurrentPage={setCurrentPage} />
            <GroupPeople
              setCurrentPage={setCurrentPage}
              items={items}
              setItems={setItems}
            />
          </>
        )}

        {currentPage === 'addGoal' && (
          <View style={styles.taskDetailPageContainer}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Add New Goal
            </Text>

            <TextInput
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              placeholder="Goal title"
              style={[styles.modalTitle, { marginBottom: 20 }]}
            />

            <TouchableOpacity
              onPress={() => {
                if (newGoalTitle.trim() === '') return;

                const newGoal = {
                  title: newGoalTitle,
                  streakNumber: 0,
                  Currentstreak: '0 days',
                  longeststreak: '0 days',
                  consistency: '0%',
                  workoutCompleted: false,
                };

                setGoals([...goals, newGoal]);
                setNewGoalTitle('');
                setCurrentPage('target');
                // No modal to close here
              }}
              style={{ alignSelf: 'center' }}>
              <Text style={{ color: '#2772BC', fontWeight: 'bold' }}>
                Add Goal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setNewGoalTitle('');
                setCurrentPage('target'); // Here you can handle navigation to another page if needed
              }}
              style={{ marginTop: 15, alignSelf: 'center' }}>
              <Text style={{ color: 'grey' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss(); // Hide keyboard first
            if (newTaskText.trim() === '') {
              setIsAddingTask(false);
              setFilteredSuggestions([]);
            } else {
              handleAddTask();
              setIsAddingTask(false);
              setNewTaskText('');
              setFilteredSuggestions([]);
            }
          }}>
          {currentPage === 'home' && (
            <>
              {isAddingTask && (
                <View style={styles.taskInputWrapper}>
                  <View style={styles.squareBox} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <TextInput
                      placeholder="Type your task"
                      value={newTaskText}
                      onFocus={() => {
                        setFilteredSuggestions(
                          goals.map((g) => `Goal - ${g.title}`)
                        );
                      }}
                      onChangeText={(text) => {
                        setNewTaskText(text);
                        if (text.length === 0) {
                          setFilteredSuggestions(
                            goals.map((g) => `Goal - ${g.title}`)
                          );
                        } else {
                          const filtered = goals
                            .map((g) => `Goal - ${g.title}`)
                            .filter((item) =>
                              item.toLowerCase().startsWith(text.toLowerCase())
                            );
                          setFilteredSuggestions(filtered);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          if (filteredSuggestions.length === 0) {
                            if (newTaskText.trim()) {
                              handleAddTask();
                            }
                            setIsAddingTask(false);
                            setNewTaskText('');
                            setFilteredSuggestions([]);
                          }
                        }, 100); // delay so suggestion tap registers first
                      }}
                      autoFocus
                      style={styles.underlineInput}
                    />

                    {filteredSuggestions.length > 0 && (
                      <View
                        style={{
                          maxHeight: 120,
                          marginTop: 5,
                          zIndex: 999,
                          elevation: 10,
                        }}>
                        <FlatList
                          data={filteredSuggestions}
                          keyExtractor={(item) => item}
                          keyboardShouldPersistTaps="handled"
                          renderItem={({ item }) => (
                            <Pressable
                              onPress={(e) => {
                                e.stopPropagation(); // Prevent outer Pressable onPress
                                handleAddSuggestionTask(item);
                              }}
                              style={{
                                padding: 8,
                                backgroundColor: '#eee',
                                marginBottom: 2,
                                borderRadius: 5,
                              }}>
                              <Text>{item}</Text>
                            </Pressable>
                          )}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Active Tasks */}
              {tasks.map((task, i) => (
                <TaskItem
                  key={i}
                  text={task.text}
                  checked={false}
                  onToggle={() => toggleCheckTask(i)}
                  onDelete={() => {
                    const updated = [...tasks];
                    updated.splice(i, 1);
                    setTasks(updated);
                  }}
                  subtitle={task.desc}
                  subtasks={task.subtasks}
                  onToggleSubtask={(subIdx) => updateSubtaskChecked(i, subIdx)}
                  onDeleteSubtask={(subIdx) => deleteSubtask(i, subIdx)}
                  onPress={() => {
                    setSelectedTask(i);
                    setEditedText(task.text);
                    setEditedDesc(task.desc);
                    setCurrentPage('editTask');
                    setIsAddingTask(false);
                  }}
                  onPressSubtask={(subIdx) => {
                    setSelectedSubtask({ taskIdx: i, subIdx });
                    setEditedSubtaskText(task.subtasks[subIdx].text);
                    setEditedSubtaskDesc(task.subtasks[subIdx].desc || '');
                    setSubtaskFromTaskModal(false);
                    setCurrentPage('editSubtask');
                    setIsAddingTask(false);
                  }}
                />
              ))}

              {/* Done Tasks Toggle */}
              <TouchableOpacity
                onPress={() => {
                  setDoneCollapsed(!doneCollapsed);
                  setIsAddingTask(false);
                }}
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  marginTop: 20,
                  marginHorizontal: 25,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontWeight: 'bold' }}>
                  Done Tasks {doneCollapsed ? '▼' : '▲'}
                </Text>
              </TouchableOpacity>

              {/* Done Tasks List */}
              {!doneCollapsed &&
                doneTasks.map((task, i) => (
                  <TaskItem
                    key={i}
                    text={task.text}
                    checked={true}
                    onToggle={() => toggleUncheckDoneTask(i)}
                    onDelete={() => {
                      const updated = [...doneTasks];
                      updated.splice(i, 1);
                      setDoneTasks(updated);
                    }}
                    subtitle={task.desc}
                    subtasks={task.subtasks}
                    onToggleSubtask={() => {}}
                    onDeleteSubtask={() => {}}
                    onPress={() => {}}
                    onPressSubtask={() => {}}
                  />
                ))}
            </>
          )}
        </Pressable>

        {currentPage === 'profile' && (
          <View style={{}}>
            {/* Profile Icon, Name, and Bio */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 30,
              }}>
              {/* Profile Icon */}
              <Ionicons name="person-circle" size={100} color="grey" />

              {/* Name and Bio */}
              <View style={{ marginLeft: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Your Name
                </Text>
                <Text style={{ fontSize: 14, color: '#555' }}>
                  Your short bio goes here
                </Text>
              </View>
            </View>

            {/* Empty Bars, <Profile/>*/}

           <View
              style={{
                height: 50,
                backgroundColor: '#eee',
                borderRadius: 10,
                marginBottom: 10,
                justifyContent: 'center',
                paddingLeft: 10,
              }}
            >
              <Text>dit is de achternaam</Text>
            </View>

            <View
              style={{
                height: 50,
                backgroundColor: '#eee',
                borderRadius: 10,
                justifyContent: 'center',
                paddingLeft: 10,
              }}
            >
              <Text>Bar 2</Text>
            </View>

          </View>
        )}

        {/* Task Modal */}
        {currentPage === 'editTask' && selectedTask !== null && (
          <View style={styles.taskDetailPageContainer}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
              {/* Back button */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...tasks];
                    updated[selectedTask].text = editedText;
                    updated[selectedTask].desc = editedDesc;
                    setSelectedTask(null);
                    setCurrentPage('home');
                    setShowAddSubtask(false);
                  }}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, marginLeft: 10 }}>go back</Text>
              </View>

              {/* Dropdown */}
              <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                <Ionicons name="ellipsis-horizontal" size={24} color="grey" />
              </TouchableOpacity>
            </View>
            {/* Task Title & Desc */}
            <TextInput
              value={editedText}
              onChangeText={setEditedText}
              style={styles.modalTitle}
            />
            <TextInput
              value={editedDesc}
              onChangeText={setEditedDesc}
              style={styles.modalDesc}
              multiline
              placeholder="Press to edit Description..."
              placeholderTextColor="grey"
            />
            {/* Subtasks */}
            <View style={{ marginVertical: 10 }}>
              {tasks[selectedTask]?.subtasks?.map((sub, idx) => (
                <View key={idx}>
                  {selectedSubtask?.subIdx === idx ? (
                    // Compact Inline Editor
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}>
                      <TouchableOpacity
                        onPress={() => updateSubtaskChecked(selectedTask, idx)}
                        style={styles.subtaskBox}>
                        {sub.checked && (
                          <Ionicons name="checkmark" size={14} color="grey" />
                        )}
                      </TouchableOpacity>

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <TextInput
                          value={editedSubtaskText}
                          onChangeText={setEditedSubtaskText}
                          style={[
                            styles.subtitleText,
                            { padding: 0, margin: 0 },
                          ]}
                          autoFocus
                        />
                        <TextInput
                          value={editedSubtaskDesc}
                          onChangeText={setEditedSubtaskDesc}
                          style={{
                            fontSize: 16,
                            color: 'black',
                            padding: 0,
                            margin: 0,
                          }}
                          placeholder="Description..."
                          placeholderTextColor="grey"
                          multiline
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() => deleteSubtask(selectedTask, idx)}>
                        <Ionicons name="trash" size={20} color="grey" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Collapsed Subtask View
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}>
                      <TouchableOpacity
                        onPress={() => updateSubtaskChecked(selectedTask, idx)}
                        style={styles.subtaskBox}>
                        {sub.checked && (
                          <Ionicons name="checkmark" size={14} color="grey" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          if (selectedSubtask) saveSubtaskInline();
                          setSelectedSubtask({
                            taskIdx: selectedTask,
                            subIdx: idx,
                          });
                          setEditedSubtaskText(sub.text);
                          setEditedSubtaskDesc(sub.desc || '');
                          setSubtaskFromTaskModal(true); // track that we came from editTask
                          setCurrentPage('editSubtask'); // open subtask view
                        }}
                        style={{ flex: 1 }}>
                        <View style={{ marginLeft: 10 }}>
                          <Text
                            style={[
                              styles.subtitleText2,
                              sub.checked && styles.strikedText,
                            ]}>
                            {sub.text}
                          </Text>
                          {sub.desc ? (
                            <Text style={{ fontSize: 12, color: 'grey' }}>
                              {sub.desc}
                            </Text>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
            {/* Click-away to save inline subtask edit */}
            {selectedSubtask && !showDropdown && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1, // ABOVE normal content, BELOW dropdown
                }}
                activeOpacity={1}
                onPress={() => saveSubtaskInline()}
              />
            )}
            {showDropdown && (
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                  }}
                  activeOpacity={1}
                  onPress={() => setShowDropdown(false)}
                />
                <View style={[styles.dropdownStyle, { zIndex: 4 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(selectedTask);
                      setShowDropdown(false);
                    }}
                    style={{ padding: 10 }}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            /* Add Subtask - Only if showAddSubtask is true */
            {showAddSubtask && (
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TextInput
                  placeholder="Add subtask"
                  value={newSubtask}
                  onChangeText={setNewSubtask}
                  style={[styles.input, { flex: 1 }]}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (newSubtask.trim()) {
                      const updated = [...tasks];
                      updated[selectedTask].subtasks.push({
                        text: newSubtask,
                        desc: '',
                        checked: false,
                      });
                      setTasks(updated);
                      setNewSubtask('');
                      setShowAddSubtask(false); // hide after adding
                    }
                  }}
                  style={{ marginLeft: 15, marginTop: 2 }}>
                  <Ionicons name="add-circle" size={30} color="grey" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Subtask Modal */}
        {currentPage === 'editSubtask' && selectedSubtask !== null && (
          <View style={styles.subtaskPageContainer}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
              {/* Back button */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...tasks];
                    const { taskIdx, subIdx } = selectedSubtask;
                    updated[taskIdx].subtasks[subIdx].text = editedSubtaskText;
                    updated[taskIdx].subtasks[subIdx].desc = editedSubtaskDesc;
                    setTasks(updated);
                    setSelectedSubtask(null);

                    if (subtaskFromTaskModal) {
                      setSelectedTask(taskIdx); // go back to task page
                      setCurrentPage('editTask');
                    } else {
                      setCurrentPage('home'); // go back home
                    }
                  }}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, marginLeft: 10 }}>go back</Text>
              </View>

              {/* Dropdown */}
              <TouchableOpacity
                onPress={() => setShowSubtaskDropdown(!showSubtaskDropdown)}>
                <Ionicons name="ellipsis-horizontal" size={24} color="grey" />
              </TouchableOpacity>
            </View>

            {showSubtaskDropdown && (
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                  activeOpacity={1}
                  onPress={() => setShowSubtaskDropdown(false)}
                />
                <View style={styles.dropdownStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      const { taskIdx, subIdx } = selectedSubtask;
                      const updated = [...tasks];
                      updated[taskIdx].subtasks.splice(subIdx, 1); // delete subtask
                      setTasks(updated);
                      setSelectedSubtask(null);
                      setShowSubtaskDropdown(false);

                      if (subtaskFromTaskModal) {
                        setSelectedTask(taskIdx);
                        setCurrentPage('editTask');
                      } else {
                        setCurrentPage('home');
                      }
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ padding: 10, color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TextInput
              value={editedSubtaskText}
              onChangeText={setEditedSubtaskText}
              style={styles.modalTitle}
            />

            <TextInput
              value={editedSubtaskDesc}
              onChangeText={setEditedSubtaskDesc}
              style={styles.modalDesc}
              multiline
              placeholder="Press to edit description..."
              placeholderTextColor="grey"
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.middleIcons}>
        <TouchableOpacity onPress={() => setCurrentPage('home')}>
          <Ionicons
            name="checkmark-circle"
            size={60}
            color={
              ['home', 'editTask', 'editSubtask', 'addTask'].includes(
                currentPage
              )
                ? '#2772BC'
                : 'grey'
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage('people')}>
          <Ionicons
            name="people-circle"
            size={60}
            color={peoplePages.includes(currentPage) ? '#2772BC' : 'grey'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage('target')}>
          <MaterialCommunityIcons
            name="target"
            size={60}
            color={
              currentPage === 'target' || currentPage === 'addGoal'
                ? '#2772BC'
                : 'grey'
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 30,
    zIndex: -10,
  },
  taskInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    fontSize: 16,
    paddingVertical: 4,
  },

  line: {
    width: 350,
    height: 2,
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
    top: 75,
  },

  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 10,
  },

  archiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // or '80%' for relative sizing
    height: 50, // adjust as needed
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },

  archiveText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'grey',
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },

  textbox1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10, // or '80%' for relative sizing
    height: 55, // adjust as needed
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#BEBEBE',
    position: 'relative',
  },
  box1text: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
    position: 'relative',
  },

  dashedLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dashed',
    marginTop: 10,
  },

  taskList: {
    marginTop: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    maxHeight: '90%',
  },

  boxscroll: {
    marginHorizontal: 20,
    maxHeight: '90%',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  squareBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskText: { fontSize: 18, color: 'black' },
  strikedText: { textDecorationLine: 'line-through', color: 'grey' },
  subtitleText: { fontSize: 14, marginTop: 2, color: 'grey' },
  subtitleText2: { fontSize: 14, marginTop: 2, color: 'black' },

  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  middleIcons: {
    position: 'absolute',
    bottom: 20,
    left: '15%',
    right: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    paddingVertical: 5,
    paddingHorizontal: 50,
    borderRadius: 20,
    gap: 30,
    zIndex: 10000,
    elevation: 10000,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 32,
    borderBottomWidth: 0,
    borderBottomColor: '#ccc',
    paddingTop: 6,
    marginBottom: 1,
    fontWeight: 'bold',
  },
  modalDesc: {
    fontSize: 18,
    borderWidth: 0,
    borderColor: '#ccc',
    paddingBottom: 0,
    borderRadius: 6,
    minHeight: 25,
    textAlignVertical: 'top',
  },

  taskDetailPageContainer: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // add this
    flex: 1,
  },
  subtaskPageContainer: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // add this
    flex: 1,
  },
  subtaskBox: {
    height: 20,
    width: 20,
    borderRadius: 3,
    borderColor: 'grey',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskText: { fontSize: 16 },

  dropdown: {
    position: 'absolute',
    top: 25,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 100,
    zIndex: 999,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
  },

  dropdownStyle: {
    position: 'absolute',
    top: 20, // right below the button
    right: 0, // aligned to the right edge
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'flex-start', // left align text inside dropdown
  },
});
