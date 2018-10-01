/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function (n) {
  var solution = new Board({'n':n})
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      solution.rows()[i][j] = 1
      if (solution.hasAnyRooksConflicts()) {
        solution.rows()[i][j] = 0
      }
    }
  }
  return solution.rows()
};


window.check = function (matrix, n) {
  var acc = 0
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        acc++
      }
    }
  }
  // console.log(JSON.stringify(matrix),acc)
  return acc===n
}


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n) {  // var solution = new Board({'n':n})   // fix me

  var solution = new Board({'n':n})   // fix me
 
 
  var Tree = function (value) {
    var newTree = Object.create(treeMethods)
    newTree.value = value
    newTree.children = []
    return newTree
  }
  
  var treeMethods = {}
  treeMethods.addChild = function (value) {
    var child = Tree(value)
    if (this.value[0] + 1 === value[0]) {
      this.children.push(child)
    } else {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].addChild(value)
      }
    }  
  }
  
  var tree = Tree([-1,-1])
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n+1; j++) {
      tree.addChild([i,j])    
    }
  }  

  treeMethods.replace = function (rowIdx) {
    if(rowIdx >= 0) {
      for (let i = rowIdx; i < n; i++) {
        for (let j = 0; j < n; j++) {
          solution.rows()[i][j] = 0
        }
      }
    }
    // console.log('removed',rowIdx,JSON.stringify(solution.rows()))
  }
  

  treeMethods.result = []

  treeMethods.contains = function () {
    // console.log(n, this.value)
    if (this.value[1] < n) {
      if (this.value[0] === -1) {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].contains()
        }
        
      } else {
        solution.rows()[this.value[0]][this.value[1]] = 1
        if (solution.hasAnyRooksConflicts()) {
          solution.rows()[this.value[0]][this.value[1]] = 0
        }
    
        if(check(solution.rows(), n)){
          this.result.push(JSON.stringify(solution.rows()))
          // console.log('made it',JSON.stringify(solution.rows()))
          // console.log('made it',n,this.result)
          if(this.value[0]>0) {
            this.replace(this.value[0]-1, n)
          }
        }
    
        for(let i=0;i<this.children.length;i++){
          if(this.children[i]) {
            // console.log(n, this.children[i].value, i)
            this.children[i].contains() // i는 뒷자리와 같음
          } 
        }
      }     
  
    } else {
      this.replace(this.value[0]-1)
    }
    return this.result.length
  }

  if (n < 10) {
    // console.log(n,'pass')
    return tree.contains()
  }


};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  var solution = new Board({'n':n})   // fix me

  var Tree = function (value) {
    var newTree = Object.create(treeMethods)
    newTree.value = value
    newTree.children = []
    return newTree
  }
  
  var treeMethods = {}
  treeMethods.addChild = function (value) {
    var child = Tree(value)
    if (this.value[0] + 1 === value[0]) {
      this.children.push(child)
    } else {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].addChild(value)
      }
    }  
  }
  
  var tree = Tree([-1,-1])
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n+1; j++) {
      tree.addChild([i,j])    
    }
  }  

  treeMethods.replace = function (rowIdx) {
    if(rowIdx >= 0) {
      for (let i = rowIdx; i < n; i++) {
        for (let j = 0; j < n; j++) {
          solution.rows()[i][j] = 0
        }
      }
    }
  }

  treeMethods.result = []

  treeMethods.contains = function () {
    if (this.value[1] < n) {
      if (this.value[0] === -1) {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].contains()
        }
        
      } else {
        solution.rows()[this.value[0]][this.value[1]] = 1
        if (solution.hasAnyQueensConflicts()) {
          solution.rows()[this.value[0]][this.value[1]] = 0
        }
    
        // console.log(JSON.stringify(solution.rows()))  //
        if(check(solution.rows(), n)){
          // console.log('made it',JSON.stringify(solution.rows()))
          // return solution.rows()
          this.result.push(JSON.stringify(solution.rows()))
          return 
          // console.log('made it',n,this.result)
          if(this.value[0]>0) {
            this.replace(this.value[0]-1)
          }
        }
    
        for(let i=0;i<this.children.length;i++){
          if(this.children[i]) {
            // console.log(n, this.children[i].value, i)
            this.children[i].contains() // i는 뒷자리와 같음
          } 
        }
      }     
  
    } else {
      this.replace(this.value[0]-1)
    }
    // console.log(n,this.result[0])
    return this.result[0]
  }
  
  tree.contains()
  var a = tree.result[0]!==undefined ? JSON.parse(tree.result[0]) : solution.rows()

  if (n < 10) {
    // console.log(n,'pass',a)
    return a
  }

};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n) {

  var solution = new Board({'n':n})   // fix me

  var Tree = function (value) {
    var newTree = Object.create(treeMethods)
    newTree.value = value
    newTree.children = []
    return newTree
  }
  
  var treeMethods = {}
  treeMethods.addChild = function (value) {
    var child = Tree(value)
    if (this.value[0] + 1 === value[0]) {
      this.children.push(child)
    } else {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].addChild(value)
      }
    }  
  }
  
  var tree = Tree([-1,-1])
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n+1; j++) {
      tree.addChild([i,j])    
    }
  }  

  // console.log(solution.rows())
  treeMethods.replace = function (rowIdx) {
    // console.log(rowIdx)
    if(rowIdx >= 0) {
      for (let i = rowIdx; i < n; i++) {
        for (let j = 0; j < n; j++) {
          solution.rows()[i][j] = 0
        }
      }
    }
    // console.log('removed',rowIdx,JSON.stringify(solution.rows()))
  }
  
  treeMethods.result = []

  treeMethods.contains = function () {
    // console.log(n, this.value)
    if (this.value[1] < n) {
      if (this.value[0] === -1) {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].contains()
        }
        
      } else {
        solution.rows()[this.value[0]][this.value[1]] = 1
        if (solution.hasAnyQueensConflicts()) {
          solution.rows()[this.value[0]][this.value[1]] = 0
        }
    
        // console.log(JSON.stringify(solution.rows()))  //
        if(check(solution.rows(), n)){
          // console.log('made it',JSON.stringify(solution.rows()))
          // return solution.rows()
          this.result.push(JSON.stringify(solution.rows()))
          
          // console.log('made it',n,this.result)
          if(this.value[0]>0) {
            this.replace(this.value[0]-1)
          }
        }
    
        for(let i=0;i<this.children.length;i++){
          if(this.children[i]) {
            // console.log(n, this.children[i].value, i)
            this.children[i].contains() // i는 뒷자리와 같음
          } 
        }
      }     
  
    } else {
      this.replace(this.value[0]-1)
    }
    // console.log(n,this.result.length)
    return this.result.length
  }


    if (n === 0) {
    return 1
  } else if (n < 10) {
    // console.log(n,'pass')
    return tree.contains()
  }
};
