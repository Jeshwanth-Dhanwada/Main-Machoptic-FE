import {
  PRODUCTIVE_CHILDS, SHOVEL_TONAGE_KEY, SHOVEL_TONS_CHILDS, COL_STEPS,
  TRUCK_TONAGE_KEY, TRUCK_TONS_CHILDS, ROW_STEPS, FILTER_OPTIONS, TRUCK_PRODUCTIVE_CHILDS
} from "../constants/chartlConstants";
import { newEdgeForShowel } from "./edgesInfo";
import { newNodeForShovel } from "./nodesInfo";

const getTonsKeys = (key) => {
  if (key === "name") return SHOVEL_TONS_CHILDS;
  else return TRUCK_TONS_CHILDS;
}

export const getHoursFiltered = (hours,id) => {
  const parentId = id.split("-").slice(-1).join("");
  return Object.keys(hours).filter(a => !a.includes(parentId)).reduce((itr, cur) => ({...itr, [cur]: hours[cur]}), {})
}

export const getColor = (minMaxVal, value, hourKey) => {
  let range = 0;
  if (minMaxVal) {
    const { min, max } = minMaxVal
    if (value > 0) {
      range = (1 / max) * value;
      return `rgb(0, 127, 0, ${range*0.7})`
    }
    else {
      range = min === 0 ? 0 : (1 / min) * value;
      return `rgb(255, 165, 0, ${range*0.7})`
    }
  } else {
    range = 1;
    if (value > 0) {
      return `rgb(0, 127, 0, ${range})`
    }
    else {
      return `rgb(255, 165, 0, ${range})`
    }
  }
}

export const getGroupedShowelsbySolutions = (nodes, solutions, groupByKey) => {
  return nodes.reduce((itr, cur) => {
    if (solutions.some(s => s == cur.ExecutionID)) {
      if (itr[cur[groupByKey]]) {
        itr[cur[groupByKey]] = {
          ...itr[cur[groupByKey]],
          [cur.ExecutionID]: cur
        }
      }
      else itr[cur[groupByKey]] = {
        [cur.ExecutionID]: cur
      }
      return itr
    }
    return itr;
  }, {})
}

const getMinePlanFormatted = (details) => {
  return details.reduce((itr, cur) => {
    itr.MinePlanId[cur.ExecutionID] = {
      ...itr.MinePlanId[cur.ExecutionID],
      [cur.MineplanID]: (itr.MinePlanId[cur.ExecutionID]?.[cur.MineplanID] || 0) + cur.AchievedTonnage
    }
    itr.Grade[cur.ExecutionID] = {
      ...itr.Grade[cur.ExecutionID],
      [cur.MaterialGrade]: (itr.Grade[cur.ExecutionID]?.[cur.MaterialGrade] || 0) + cur.AchievedTonnage
    }
    itr.Origin[cur.ExecutionID] = {
      ...itr.Origin[cur.ExecutionID],
      [cur.ShovelOrigin]: (itr.Origin[cur.ExecutionID]?.[cur.ShovelOrigin] || 0) + cur.AchievedTonnage
    }
    itr.OD[cur.ExecutionID] = {
      ...itr.OD[cur.ExecutionID],
      [cur.ODPath]: (itr.OD[cur.ExecutionID]?.[cur.ODPath] || 0) + cur.AchievedTonnage
    }
    return itr;
  }, { MinePlanId: {}, Grade: {}, Origin: {}, OD: {} })
}

export const getNodesEdgesFormattedMines = (details, sol, groupByKey, onDoubbleClick, filterType) => {
  const groupNodesBySolution = getMinePlanFormatted(details);
  const readyData = Object.keys(groupNodesBySolution).reduce((itr, cur) => {
    itr[cur] = Object.keys(groupNodesBySolution[cur][sol[0]]).reduce((a, b) => (a[b] = groupNodesBySolution[cur][sol[1]][b] - groupNodesBySolution[cur][sol[0]][b], a), {})
    return itr
  }, { MinePlanId: {}, Grade: {}, Origin: {}, OD: {} })
  const subchildlength = Object.keys(readyData).length
  let nodes = [];
  let edges = [];
  let totalVals = 0;
  Object.keys(readyData).map((parent, x) => {
    const parents = readyData[parent];
    const parentVal = Object.values(parents).reduce((a, b) => a + b)
    totalVals += parentVal;
    const parentColor = getColor(null, parentVal)
    nodes.push(newNodeForShovel(`parent-${parent}`, parentVal, -260, (x * COL_STEPS), true, parentColor, onDoubbleClick, "left", "right"))
    edges.push(newEdgeForShowel(`parent-${parent}-edge`, `main-Achieved Tonnage`, `parent-${parent}`, true))
    const childMinMax = {
      min: Math.min(...Object.values(parents)),
      max: Math.max(...Object.values(parents))
    }
    const filteredChilds = getFilteredValues(parents, filterType);
    Object.keys(parents).filter(a => filteredChilds.hasOwnProperty(a)).map((child, y) => {
      const childColor = getColor(childMinMax, parents[child]);
      nodes.push(newNodeForShovel(`child-${child}-${parent}`, parents[child], (y * 200), 50 + (COL_STEPS * x), true, childColor, onDoubbleClick, "top", "right", child))
      edges.push(newEdgeForShowel(`child-${parent}-${child}-edge`, `parent-${parent}`, `child-${child}-${parent}`, true))
    })
    nodes.push(newNodeForShovel(`main-Achieved Tonnage`, totalVals/subchildlength, -400, -100, false, getColor(childMinMax, totalVals), onDoubbleClick, "top", "bottom"))
  })
  return {
    shovelNodes: nodes,
    shovelEdges: edges
  }
}

export const getNodesEdgesFormatted = (details, sol, groupByKey, onDoubbleClick, filterType) => {
  const groupNodesBySolution = getGroupedShowelsbySolutions(details, sol, groupByKey)
  let tonsData = {};
  let nodesJson = {};
  let productiveChild = {};
  const dataTemplate = getTonsKeys(groupByKey);
  const productiveChilds = groupByKey === "name" ? PRODUCTIVE_CHILDS : TRUCK_PRODUCTIVE_CHILDS;
  const tonageKey = groupByKey === "name" ? SHOVEL_TONAGE_KEY : TRUCK_TONAGE_KEY;
  Object.keys(groupNodesBySolution).map((key) => {
    const data = groupNodesBySolution[key];
    nodesJson[key] = Object.keys(dataTemplate).reduce((itr, tonsKey) => {
      const label = dataTemplate[tonsKey]
      itr[label] = data[sol[1]][tonsKey] - data[sol[0]][tonsKey]
      return itr;
    }, {})
    tonsData[key] = data[sol[1]][tonageKey] - data[sol[0]][tonageKey];
    productiveChild[key] = Object.keys(productiveChilds).reduce((itr, pchild) => {
      const label = productiveChilds[pchild]
      itr[label] = data[sol[1]][pchild] - data[sol[0]][pchild]
      return itr;
    }, {})
  })
  let shovelNodes = [];
  let shovelEdges = [];
  const showelProductionVal = Object.values(tonsData).reduce((a, b) => a + b, 0);
  let parentPosValue = -30;
  let childPosValue = -85;
  const parentMinMaxVal = {
    min: Math.min(...Object.values(tonsData)),
    max: Math.max(...Object.values(tonsData))
  }
  const tonsFilter = getFilteredValues(tonsData, filterType);
  // loop for childs of production node
  Object.keys(nodesJson).filter(a => tonsFilter.hasOwnProperty(a)).map((item, x) => {
    const tonsNodes = nodesJson[item];
    let childValStart = childPosValue;
    const childMinMaxVal = {
      min: Math.min(...Object.values(nodesJson[item])),
      max: Math.max(...Object.values(nodesJson[item]))
    }
    // loop for tons data
    const tonsChildFilter = getFilteredValues(tonsNodes, filterType);
    Object.keys(tonsNodes).filter(a => tonsChildFilter.hasOwnProperty(a)).map((child, y, filteredTons) => {
      const childColor = getColor(childMinMaxVal, tonsNodes[child]);
      if (child === "Productive Time") {
        const productiveChilds = productiveChild[item];
        let productiveChildPos = filteredTons.length * 200 - 150;
        const productiveChildMinMaxVal = {
          min: Math.min(...Object.values(productiveChild[item])),
          max: Math.max(...Object.values(productiveChild[item]))
        }
        // loop for childs of productive nodes
        const pChildFilter = getFilteredValues(productiveChilds, filterType);
        Object.keys(productiveChilds).filter(a => pChildFilter.hasOwnProperty(a)).map((pchild) => {
          const baseChild = productiveChilds[pchild];
          const productiveChildColor = getColor(productiveChildMinMaxVal, baseChild);
          shovelNodes.push(newNodeForShovel(`${item}-${pchild}`, baseChild, productiveChildPos, 150 + (x * COL_STEPS), true, productiveChildColor, onDoubbleClick, "top", "right"))
          shovelEdges.push(newEdgeForShowel(`${child}-${item}-${item}-${pchild}-edge`, `${item}-${child}`, `${item}-${pchild}`, true))
          productiveChildPos += ROW_STEPS;
        })
      }
      shovelNodes.push(newNodeForShovel(`${item}-${child}`, tonsNodes[child], childValStart, 40 + (x * COL_STEPS), true, childColor, onDoubbleClick, "top", "bottom"))
      shovelEdges.push(newEdgeForShowel(`${item}-${child}-edge`, `Parent-${item}`, `${item}-${child}`, true))
      childValStart += ROW_STEPS;
    })
    const parentC = getColor(parentMinMaxVal, tonsData[item])
    shovelNodes.push(newNodeForShovel(`Parent-${item}`, tonsData[item], -260, parentPosValue, true, parentC, onDoubbleClick, "left", "right"))
    shovelEdges.push(newEdgeForShowel(`Parent-${item}-edge`, `root-${getName(groupByKey)} Production`, `Parent-${item}`, true))
    parentPosValue += COL_STEPS;
  })
  shovelNodes.push(newNodeForShovel(`root-${getName(groupByKey)} Production`, showelProductionVal, -400, -100, false, getColor(null, showelProductionVal), onDoubbleClick, "top", "bottom"))
  return {
    shovelNodes,
    shovelEdges
  }
}

const getName = (groupByKey) => {
  if (groupByKey === "name") return "Shovel";
  else return "Truck"
}

const getFilteredValues = (data, type) => {
  let filtered = {}
// console.log(type, "typetype");
  // const childLength = filterCount ? filterCount : Object.keys(data).length
  if (type.includes(FILTER_OPTIONS[3]) || type.length === 0) return data;
  if (type.includes(FILTER_OPTIONS[1])) {
    filtered = { ...filtered, ...Object.fromEntries(Object.entries(data).filter(item => item[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 5)) }
  }
  if (type.includes(FILTER_OPTIONS[2])) {
    filtered = { ...filtered, ...Object.fromEntries(Object.entries(data).filter(item => item[1] < 0).sort((a, b) => a[1] - b[1]).slice(0, 5)) }
  }
  return filtered
}

export const generateNums = () => {
  return Array(5).fill(1).map((a, i) => i + 1)
}

export const getFormattedParametes = (allParams, key="Queue") => {
  return allParams.reduce((itr, cur) => {
    const shovelId = cur.shovelID, sol = cur.ExecutionID
    const queueVal = key === "Queue" ? cur.TrucksQueuing : cur.TripsCount;
    if (itr[shovelId]) {
      if (itr[shovelId][`shovel${key}${sol}`]) itr[shovelId][`shovel${key}${sol}`].push(queueVal);
      else itr[shovelId][`shovel${key}${sol}`] = [queueVal]
      // for start time
      if (itr[shovelId][`startTimes`][`${cur.FiveminInstance}${key}${sol}`]) {
        if(itr[shovelId][`startTimes`][`${cur.FiveminInstance}${key}${sol}`] > cur.timeinstance) 
        itr[shovelId][`startTimes`][`${cur.FiveminInstance}${key}${sol}`] = cur.timeinstance;
      }
      else itr[shovelId][`startTimes`] = {
        ...itr[shovelId][`startTimes`] || {},
        [`${cur.FiveminInstance}${key}${sol}`] : cur.timeinstance
      }

      if (itr[shovelId][cur.Hour]) {
        if (itr[shovelId][cur.Hour][`hour${key}${sol}`]) itr[shovelId][cur.Hour][`hour${key}${sol}`].push(queueVal);
        else itr[shovelId][cur.Hour][`hour${key}${sol}`] = [queueVal]
        if (itr[shovelId][cur.Hour][cur.FiveminInstance]) {
          if (itr[shovelId][cur.Hour][cur.FiveminInstance][`instance${key}${sol}`])
            itr[shovelId][cur.Hour][cur.FiveminInstance][`instance${key}${sol}`].push(queueVal);
          else itr[shovelId][cur.Hour][cur.FiveminInstance][`instance${key}${sol}`] = [queueVal]
        }
        else {
          itr[shovelId][cur.Hour] = {
            ...itr[shovelId][cur.Hour],
            [cur.FiveminInstance]: {
              [`instance${key}${sol}`]: [queueVal],
            }
          }
        }
      }
      else {
        itr[shovelId] = {
          ...itr[shovelId],
          [cur.Hour]: {
            [`hour${key}${sol}`]: [queueVal],
            [cur.FiveminInstance]: {
              [`instance${key}${sol}`]: [queueVal],
            }
          }
        }
      }
    }
    else {
      itr[shovelId] = {
        [`shovel${key}${sol}`]: [queueVal],
        [`startTimes`]: {
          [`${cur.FiveminInstance}${key}${sol}`] : cur.timeinstance
        },
        [cur.Hour]: {
          [`hour${key}${sol}`]: [queueVal],
          [cur.FiveminInstance]: {
            [`instance${key}${sol}`]: [queueVal],
          }
        }
      }
    }
    return itr
  }, {})
}

const getAverage = (arr = []) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const getAveragebyDiff = (que1, que2, sol) => {
  if (sol[0] == 1) {
    return getAverage(que2) - getAverage(que1)
  }
  return getAverage(que1) - getAverage(que2);
}

const getSum=(arr=[]) => arr.reduce((a,b) => a+b,0); 

const getSumByDiff = (que1, que2, sol) => {
  if (sol[0] == 1) {
    return getSum(que2) - getSum(que1)
  }
  return getSum(que2) - getSum(que1);
}

const getchildParamVals = (parent, queKey, sol, paramKey, seperateSolutions) => {
  const nodeVals = Object.keys(parent).reduce((itr, key) => {
    // const que1 = parent[key][`${queKey}18`] || [];
    const que1 = parent[key][`${queKey}${sol[0]}`] || [];
    const que2 = parent[key][`${queKey}${sol[1]}`] || [];
    
    const val = paramKey === "Trips" ? getSumByDiff(que1, que2, sol) : getAveragebyDiff(que1, que2, sol);
    if(seperateSolutions) itr[key] = {
                                      diff:+val.toFixed(2),
                                      sols:[getSum(que1), getSum(que2)]
                                    }
    else itr[key] = +val.toFixed(2);
    return itr
  },{})

  const getSols = (nodeVals) => {
    return Object.values(nodeVals).map(a => a.diff)
  }

  const childMinMax = {
    min: Math.min(...Object.values(seperateSolutions ?  getSols(nodeVals): nodeVals)),
    max: Math.max(...Object.values(seperateSolutions ? getSols(nodeVals) : nodeVals))
  }
  // console.log("seperateSolutions..",nodeVals)

  return {
    nodeVals,
    childMinMax
  }
}

const getInstance = (obj) => {
  return Object.entries(obj).reduce((a, b) => ({...a, [b[0]] : b[1].diff}), {});
}

export const getParameterNodesEdges = (details, sol, onDoubbleClick, filterType, paramKey, expandedNodes, allExcScenarios={}, selectedMineId) => {
  let shovelNodes = [];
  let shovelEdges = [];
  let shovelnodePos = -30;
  const expandeds = Object.keys(expandedNodes).filter((a) => expandedNodes[a]);
  // shovel nodes
  const {nodeVals: shovelValList, childMinMax: shovelMinMaxChild} = getchildParamVals(details, `shovel${paramKey}`, sol, paramKey);
  const filteredNodes = getFilteredValues(shovelValList, filterType);
  const productionName = paramKey === "Trips"? "Trips Count":"Average Queue";
  // console.log("filtered nodes..",filteredNodes)
  Object.keys(details).filter(a => filteredNodes.hasOwnProperty(a)).map((shovelKey, x) => {
   
    let hourNodeStart = -85
    const isProdExpanded = !expandedNodes.root;
    const { [`shovel${paramKey}${sol[0]}`]: a, [`shovel${paramKey}${sol[1]}`]:b,startTimes, ...hourNodes } = details[shovelKey];
    const shovelVal = shovelValList[shovelKey];
    // hour nodes
    const {nodeVals: hourNodesVals, childMinMax: houurChildMinMax} = getchildParamVals(hourNodes, `hour${paramKey}`, sol, paramKey);
    const hoursFilteres = getFilteredValues(hourNodesVals, filterType);
    Object.keys(hourNodes).filter(a => hoursFilteres.hasOwnProperty(a)).map((hourKey, y) => {
      const hourVal = hourNodesVals[hourKey]
      const showelId = shovelKey.split("-").slice(-2).join("-")
      const isShovelExpanded = !expandedNodes.shovel[showelId] || isProdExpanded;
      const hourExpandKey = showelId.split("-").slice(-1).join("") + "-" + hourKey;
      const {[`hour${paramKey}1`]:a, [`hour${paramKey}2`]: b, ...instanceItems} = hourNodes[hourKey]
      shovelNodes.push(newNodeForShovel(`hour-${shovelKey}-${hourKey}`, hourVal, hourNodeStart, 40 + (x * COL_STEPS), isShovelExpanded, getColor(houurChildMinMax, hourVal, hourKey), onDoubbleClick, "top", "bottom", "Hour " + hourKey))
      shovelEdges.push(newEdgeForShowel(`hour-${hourKey} -${shovelKey}-edge`, `shovel-${shovelKey}`, `hour-${shovelKey}-${hourKey}`, isShovelExpanded));
      
      let instancePos = y * 200;
      // Instance Nodes
      const {nodeVals: instanceVals, childMinMax: instanceChildMinMax} = getchildParamVals(instanceItems, `instance${paramKey}`, sol, paramKey, true);
      const instanceFilteres = getFilteredValues(getInstance(instanceVals), filterType);
      Object.keys(instanceItems).filter(a => instanceFilteres.hasOwnProperty(a)).map((instanceKey) => {
        // console.log(hourExpandKey, instanceChildMinMax, "instanceChildMinMax");
        const isHourExpanded = !expandedNodes.hour[hourExpandKey] || isShovelExpanded || isProdExpanded
        let {diff:instanceVal, sols: instanceSols} = instanceVals[instanceKey];
        shovelNodes.push(newNodeForShovel(`instance-${shovelKey}-${hourKey}-${instanceKey}`, instanceVal, instancePos, 150 + (x * COL_STEPS), isHourExpanded, getColor(instanceChildMinMax, instanceVal), onDoubbleClick, "top", "bottom", "5 min inst " + instanceKey))
        shovelEdges.push(newEdgeForShowel(`hour-${hourKey}-${shovelKey}-${instanceKey}-edge`, `hour-${shovelKey}-${hourKey}`, `instance-${shovelKey}-${hourKey}-${instanceKey}`, isHourExpanded))
        // Instance solutions
        instanceSols.map((solution, i) => {
          const execId = allExcScenarios[`exe-${sol[i]}`];
          const instanceStartTime = startTimes[`${instanceKey}${paramKey}${sol[i]}`];
          const hyperLink = <a href={`http://localhost:4200/?startTime=${instanceStartTime}&shovelId=${shovelKey}&mineId=${selectedMineId}&scenario=${sol[i]}&execution=${execId}&server=default`} target="_blank">{`Solution (${sol[i]})`}</a>
          const isHourExpanded = !expandedNodes.sol[solution] || isHourExpanded || isShovelExpanded || isProdExpanded
          shovelNodes.push(newNodeForShovel(`instance-sol-${shovelKey}-${hourKey}-${instanceKey}-${i}`, solution, instancePos-100+(i*200), 240 + (x * COL_STEPS), isHourExpanded, getColor(instanceChildMinMax, 0), onDoubbleClick, "top", "bottom",hyperLink, true))
          shovelEdges.push(newEdgeForShowel(`hour-${hourKey}-${shovelKey}-${instanceKey}-edge-${i}`,`instance-${shovelKey}-${hourKey}-${instanceKey}`, `instance-sol-${shovelKey}-${hourKey}-${instanceKey}-${i}`, isHourExpanded));
        })
        instancePos+=200;
      })
      hourNodeStart += ROW_STEPS;
    })
    shovelNodes.push(newNodeForShovel(`shovel-${shovelKey}`, shovelVal, -260, shovelnodePos, isProdExpanded, getColor(shovelMinMaxChild, shovelVal), onDoubbleClick, "left", "right"))
    shovelEdges.push(newEdgeForShowel(`shovel-${shovelKey}-edge`, `root-${productionName}`, `shovel-${shovelKey}`, isProdExpanded))
    shovelnodePos += COL_STEPS;
  })
  const productionVal = paramKey === "Trips"? getSum(Object.values(shovelValList)) : +getAverage(Object.values(shovelValList)).toFixed(2);
  shovelNodes.push(newNodeForShovel(`root-${productionName}`, productionVal, -400, -100, false, getColor(null, productionVal), onDoubbleClick, "top", "bottom"))
  return {
    shovelNodes,
    shovelEdges
  }
}