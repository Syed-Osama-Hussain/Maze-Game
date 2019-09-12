const canvas = document.querySelector("#canvas");
const solveBtn = document.querySelector("#solveBtn");
const resetBtn = document.querySelector("#resetBtn");
const context = canvas.getContext("2d");
let count = 0;
let prevNode = { x: 0, y: 0 };
let closedSetCounter = 0;
let closedSetTimer;
let lines = [];
let timer;
let pathTimer;
let counter = 0;
let frontier = [];
let maze = [];
let x, y;
let done = false;

window.onload = addListeners();

function addListeners() {
  resetBtn.addEventListener("click", function () {
    start();
  });

  solveBtn.addEventListener("click", function () {
    if (done) {
      const path = AStar();
    } else {
      alert("Please wait till the maze is complete!");
    }
  });

  document.body.addEventListener("keydown", function (e) {
    if (done) {

      if (prevNode.x === 525 && prevNode.y === 525) {
        alert("You Won!");
      }

      if (e.keyCode === 37) {

        if (lines.find(line => line.x1 === prevNode.x && line.y1 === prevNode.y && line.x2 === prevNode.x && line.y2 === prevNode.y + 25)) {
          context.fillStyle = "white";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);
          prevNode.x = prevNode.x - 25;

          context.fillStyle = "orange";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);
        }
      }

      //up
      if (e.keyCode === 38) {

        if (lines.find(line => line.x1 === prevNode.x && line.y1 === prevNode.y && line.x2 === prevNode.x + 25 && line.y2 === prevNode.y)) {
          context.fillStyle = "white";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);
          prevNode.y = prevNode.y - 25;

          context.fillStyle = "orange";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);

        }
      }

      //right
      if (e.keyCode === 39 && prevNode.x + 25 < 550) {

        if (lines.find(line => line.x1 === prevNode.x + 25 && line.y1 === prevNode.y && line.x2 === prevNode.x + 25 && line.y2 === prevNode.y + 25)) {
          context.fillStyle = "white";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);
          prevNode.x = prevNode.x + 25;

          context.fillStyle = "orange";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);

        }
      }

      //down
      if (e.keyCode === 40 && prevNode.y + 25 < 550) {

        if (lines.find(line => line.x1 === prevNode.x && line.y1 === prevNode.y + 25 && line.x2 === prevNode.x + 25 && line.y2 === prevNode.y + 25)) {
          context.fillStyle = "white";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);
          prevNode.y = prevNode.y + 25;

          context.fillStyle = "orange";
          context.fillRect(prevNode.x + 1, prevNode.y + 1, 23, 23);

        }
      }
    }
  });
  start();
}

function start() {
  init();
  createGrid();
  x = randomBox(0, 10) * 25;
  y = randomBox(0, 10) * 25;
  maze.push({ x: x, y: y });
  underRange(x) && frontier.push({ x: x + 25, y: y });
  underRange(y) && frontier.push({ x: x, y: y + 25 });
  aboveRange(x) && frontier.push({ x: x - 25, y: y });
  aboveRange(y) && frontier.push({ x: x, y: y - 25 });
  primsMaze();
  context.strokeStyle = "white";
  timer = setInterval(createMaze, 25);
};


function aboveRange(x) {
  if (x - 25 >= 0) {
    return true;
  } else {
    return false;
  }
}

function underRange(x) {
  if (x + 25 <= 550) {
    return true;
  } else {
    return false;
  }
}


function init() {
  count = 0;
  lines = [];
  prevNode = { x: 0, y: 0 };
  if (timer)
    clearInterval(timer);

  if (pathTimer)
    clearInterval(pathTimer);

  if (closedSetTimer)
    clearInterval(closedSetTimer);
  done = false;
  closedSetCounter = 0;
  counter = 0;
  frontier = [];
  maze = [];
  x = 0;
  y = 0;
  context.fillStyle = "white";
  context.fillRect(0, 0, 550, 550);
  canvas.width = 550;
  canvas.height = 550;

}


function createGrid() {
  for (let x = 0; x <= 550; x += 25) {
    context.moveTo(x, 0);
    context.lineTo(x, 550);
  }

  for (let x = 0; x <= 550; x += 25) {
    context.moveTo(0, x);
    context.lineTo(550, x);
  }

  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.stroke();
}


function primsMaze() {
  while (frontier.length !== 0) {
    let randFrontier = frontier[randomBox(0, frontier.length - 1)];
    let neighbor = isNeighbor(randFrontier, maze);
    if (neighbor.position === "above") {
      underRange(neighbor.x) && lines.push({ x1: neighbor.x, y1: neighbor.y, x2: neighbor.x + 25, y2: neighbor.y });
    }

    if (neighbor.position === "below") {
      underRange(randFrontier.x) && lines.push({ x1: randFrontier.x, y1: randFrontier.y, x2: randFrontier.x + 25, y2: randFrontier.y });
    }

    if (neighbor.position === "right") {
      underRange(randFrontier.y) && lines.push({ x1: randFrontier.x, y1: randFrontier.y, x2: randFrontier.x, y2: randFrontier.y + 25 });
    }

    if (neighbor.position === "left") {
      underRange(neighbor.y) && lines.push({ x1: neighbor.x, y1: neighbor.y, x2: neighbor.x, y2: neighbor.y + 25 });
    }
    addFrontier(randFrontier);
    frontier.splice(frontier.indexOf(randFrontier), 1);
  }
}


function addFrontier(point) {

  if (point_not_present(maze, point)) {
    maze.push(point);

    if (point_not_present(maze, { x: point.x + 25, y: point.y })) {
      underRange(point.x) && frontier.push({ x: point.x + 25, y: point.y });
    }

    if (point_not_present(maze, { x: point.x, y: point.y + 25 })) {
      underRange(point.y) && frontier.push({ x: point.x, y: point.y + 25 });
    }

    if (point_not_present(maze, { x: point.x - 25, y: point.y })) {
      aboveRange(point.x) && frontier.push({ x: point.x - 25, y: point.y });
    }

    if (point_not_present(maze, { x: point.x - 25, y: point.y })) {
      aboveRange(point.y) && frontier.push({ x: point.x, y: point.y - 25 });
    }
  }
}


function point_not_present(maze, point) {
  if (
    maze.filter(mazepoint => mazepoint.x === point.x && mazepoint.y === point.y)
      .length === 0) {
    return true;
  } else {
    return false;
  }
}


function point_present(maze, point) {
  if (
    maze.filter(mazepoint => mazepoint.x === point.x && mazepoint.y === point.y)
      .length !== 0) {
    return true;
  } else {
    return false;
  }
}



function createMaze() {
  if (count === lines.length - 1) {
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.rect(0, 0, 550, 550);
    context.stroke();
    done = !done;
    context.fillStyle = "orange";
    context.fillRect(1, 1, 23, 23);
    clearInterval(timer);
  } else {

    context.beginPath();
    context.moveTo(lines[count].x1, lines[count].y1);
    context.lineTo(lines[count].x2, lines[count].y2);
    context.stroke();
    count++;
  }
}


function applyAstar(path) {
  if (counter === path.length - 1) {
    context.fillStyle = "orange";
    context.fillRect(1, 1, 24, 24);
    clearInterval(pathTimer)
  } else {
    context.fillStyle = "orange";
    context.fillRect(path[counter].x + 1, path[counter].y + 1, 24, 24);
    counter++;
  }
}



function isNeighbor(point, maze) {
  let front = { x: 0, y: 0, position: "none" };
  front.x = point.x;
  front.y = point.y - 25;
  front.position = "below";
  if (point_present(maze, front)) {
    return front;
  }

  front.x = point.x;
  front.y = point.y + 25;
  front.position = "above";
  if (point_present(maze, front)) {
    return front;
  }

  front.x = point.x + 25;
  front.y = point.y;
  front.position = "left";
  if (point_present(maze, front)) {
    return front;
  }

  front.x = point.x - 25;
  front.y = point.y;
  front.position = "right";
  if (point_present(maze, front)) {
    return front;
  }
}

function randomBox(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function calHval(src, dest) {
  return Math.sqrt(Math.pow(src.x - dest.x, 2) + Math.pow(src.y - dest.y, 2));
}

function calFval(node) {
  return node.hval + node.gval;
}

function present_in_lines(Lines, point) {
  if (
    Lines.filter(linespoint => linespoint.x1 === point.x && linespoint.y1 === point.y)
      .length !== 0) {
    return true;
  } else {
    return false;
  }
}

function get_Neighbors(nodes, point) {
  let points = [];
  let temp = lines.find(line => line.x1 === point.x + 25 && line.y1 === point.y && line.x2 === point.x + 25 && line.y2 === point.y + 25);

  let neighbor;

  if (temp) {
    neighbor = nodes.find(node => node.x === point.x + 25 && node.y === point.y)
    neighbor && points.push(neighbor);
  }


  temp = lines.find(line => line.x1 === point.x && line.y1 === point.y && line.x2 === point.x && line.y2 === point.y + 25);

  if (temp) {
    neighbor = nodes.find(node => node.x === point.x - 25 && node.y === point.y)
    neighbor && points.push(neighbor);
  }

  temp = lines.find(line => line.x1 === point.x && line.y1 === point.y && line.x2 === point.x + 25 && line.y2 === point.y);

  if (temp) {
    neighbor = nodes.find(node => node.x === point.x && node.y === point.y - 25)
    neighbor && points.push(neighbor);
  }

  temp = lines.find(line => line.x1 === point.x && line.y1 === point.y + 25 && line.x2 === point.x + 25 && line.y2 === point.y + 25);

  if (temp) {
    neighbor = nodes.find(node => node.x === point.x && node.y === point.y + 25)
    neighbor && points.push(neighbor);
  }

  return points;
}



function equals(src, dest) {
  return src.x === dest.x && src.y === dest.y ? true : false;
}


function createNodes() {
  let nodes = [];
  for (let i = 0; i <= 525; i += 25) {

    for (let j = 0; j <= 525; j += 25) {
      nodes.push({ x: i, y: j, fval: Number.MAX_SAFE_INTEGER, gval: 25, hval: calHval({ x: i, y: j }, { x: 525, y: 525 }) });
    }
  }
  return nodes;
}


function updateNodes(nodes, point) {
  let tempPoint = nodes.find(node => node.x === point.x && node.y === point.y);
  let index = nodes.indexOf(tempPoint);
  nodes[index] = { ...point };
  return nodes;
}


function AStar() {
  let nodes = createNodes();
  const source = { x: 0, y: 0 };
  const Dest = { x: 525, y: 525 };
  let current = source;
  let parent = {};
  let closedSet = [];
  let openSet = [];

  current.gval = 0;
  current.hval = (calHval(current, Dest));
  current.fval = (calFval(current));

  while (!equals(current, Dest)) {

    let neighbors = get_Neighbors(nodes, current);
    for (let neighbor of neighbors) {
      if (point_not_present(closedSet, neighbor) && point_not_present(openSet, neighbor)) {
        let gval = 25 + current.gval;

        let fval = gval + calHval(neighbor, Dest);

        if (fval < neighbor.fval) {
          neighbor.fval = fval;
          neighbor.gval = gval;
          parent[`${neighbor.x}${neighbor.y}`] = current;
        }
        nodes = updateNodes(nodes, neighbor);
        openSet.push(neighbor);
      }
    }
    closedSet.push(current);
    current = SelectMin(openSet);
    openSet.splice(openSet.indexOf(current), 1);

  }
  parent["first"] = Dest;
  const path = DisplayPath(parent);
  closedSetTimer = setInterval(applyClosedSet, 50, { closedSet, path });
  return path;
}


function applyClosedSet(data) {
  if (closedSetCounter === data.closedSet.length - 1) {
    pathTimer = setInterval(applyAstar, 100, data.path)
    clearInterval(closedSetTimer)
  } else {
    context.fillStyle = "cyan";
    context.fillRect(data.closedSet[closedSetCounter].x + 1, data.closedSet[closedSetCounter].y + 1, 24, 24);
    closedSetCounter++;
  }
}


function SelectMin(openSet) {
  let min = Number.MAX_SAFE_INTEGER;

  openSet.forEach(point => {
    if (point.fval < min) {
      min = point;
    }
  })

  return min;
}



function DisplayPath(path) {
  let Path = [];
  let i = path["first"];
  Path.push(path["first"])

  do {
    if (path[`${i.x}${i.y}`] !== undefined) {
      i = path[`${i.x}${i.y}`];
      Path.push(i)
    }
    else {
      break;
    }
  } while (true);
  return Path;
}