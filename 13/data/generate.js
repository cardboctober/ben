const KEY = process.env.MEETUP_KEY
const URL_NAME = process.env.MEETUP_URL_NAME

const meetup = require('meetup-api')({
    key: KEY
})

let events = []
/*{
  id: _,
  name: _,
  attendees: [2,5,6,7]
}*/

var requests = 0

meetup.getEvents(
  {
    group_urlname:URL_NAME,
    status:'past'
  }, (error,response) => {


    events =
      response.results.map(ev => ({
        id:   ev.id,
        name: ev.name,
        time: ev.time
      }))

    events
      .forEach( event => {

        requests++

        meetup.getEventAttendance({
          urlname: URL_NAME,
          id: event.id
        }, (err, response) => {
          event.attendees = response.filter(
            u => u.status == 'attended'
          )
          .map( u => u.member.id)

          requests--
          if(requests === 0) {
            console.log(JSON.stringify(events))
          }
        })

      })

  }
)
