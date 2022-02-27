const fs = require('fs');

const guid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const requiredFields = [ "title", "text", "creation_date", "task_status" ]

module.exports = app => {
  //get all tasks
  app.get('/tasks', (req, res) => {
    try {
      fs.readFile(`${__dirname}/../DB.json`, (err, data) => {
        if (err) throw err;
        const { tasks } = JSON.parse(data);
        res.send(tasks)
      })
    } catch (error) {
      res.send({ status: 500, error })
    }
  });

  //post new task
  app.post('/tasks', (req, res) => {
    try {
      //new task from ui
      const task = req.body;
      const isValid = requiredFields.reduce((res, val) => {
        if (!Object.keys(task).some(key => key === val)) {
          return false;
        }
        return res;
      }, true)
      if (isValid) {
        //get all tasks from DB.json
        fs.readFile(`${__dirname}/../DB.json`, (err, data) => {
          if (err) throw err;
          const db = JSON.parse(data);
          const updatedData = {
            ...db,
            tasks: [
              ...db.tasks,
              {
                ...task,
                id: guid()
              }
            ]
          }
          const json = JSON.stringify(updatedData)
          //write new info to json
          fs.writeFile(`${__dirname}/../DB.json`, json, 'utf-8', (err, data) => {
            if (err) throw err;
            res.send({ status: 200 })
          })
        });
      } else {
        res.send({ 
          status: 400, 
          error: {
            en: 'Fields: title, text, creation_date, task_status are required',    
            ru: 'Поля: title, text, creation_date, task_status - обязательные',    
          }
        })
      }
    } catch (error) {
      res.send({ status: 500, error })
    }
  });

  //put task
  app.put('/tasks', (req, res) => {
    try {
      //new task from ui
      const task = req.body;
      //get all tasks from DB.json
      const isValid = requiredFields.reduce((res, val) => {
        if (!Object.keys(task).some(key => key === val)) {
          return false;
        }
        return res;
      }, true)
      if (isValid) {
        fs.readFile(`${__dirname}/../DB.json`, (err, data) => {
          if (err) throw err;
          const db = JSON.parse(data);
          const exists = db.tasks.some(el => el.id === task.id)
          if (exists) {
            const updatedData = {
              ...db,
              tasks: db.tasks.map(el => {
                if (el.id === task.id) {
                  return task;
                }
                return el;
              })
            }
            const json = JSON.stringify(updatedData)
            //write new info to json
            fs.writeFile(`${__dirname}/../DB.json`, json, 'utf-8', (err, data) => {
              if (err) throw err;
              res.send({ status: 200 })
            })
          } else {
            res.send({ 
              status: 400, 
              error: {
                en: 'No task with such id.',
                ru: 'Бля ну не тот id'
              } 
            })
          }
        });  
      } else {
        res.send({ 
          status: 400, 
          error: {
            en: 'Fields: title, text, creation_date, task_status are required',    
            ru: 'Поля: title, text, creation_date, task_status - обязательные',    
          }
        })
      }  
    } catch (error) {
      res.send({ status: 500, error })
    }
    console.log('here')
  })

  //delete task by id:
  app.delete('/tasks', (req, res) => {
    const { id } = req.query;
    //get all tasks from DB.json
    fs.readFile(`${__dirname}/../DB.json`, (err, data) => {
      try {
        if (err) throw err;
        const db = JSON.parse(data);
        const exists = db.tasks.some(el => el.id === id)
        if (exists) {
          const updatedData = {
            ...db,
            tasks: db.tasks.filter(task => task.id !== id)
          };
          const json = JSON.stringify(updatedData)
          //write new info to json
          fs.writeFile(`${__dirname}/../DB.json`, json, 'utf-8', (err, data) => {
            if (err) throw err;
            res.send({ status: 200 })
          })
        } else {
          res.send({ 
            status: 400, 
            error: {
              en: 'No task with such id.',
              ru: 'Бля ну не тот id'
            } 
          })
        }
      } catch (error) {
        res.send({ status: 500, error })
      }
    });
  });
}