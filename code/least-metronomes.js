/**
 * This is a list of notes making up a rhythm. 
 * The notes can represent any rhythmic value, as long as every one of them is the same value. 
 * For example, this rhythm is made of up  all 16th notes and 16th rests. 
 * Each '1' represents a note, each '0' represents a rest.
 * Each line is a single quarter note, just to make it easier to read.
 */
notes = [
    1, 1, 1, 0, 
    1, 0, 1, 0, 
    1, 0, 1, 0,
    1, 0, 1, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    1, 0, 1, 0,
]

/**
 * For the given list of notes (specified with the format used in the example 
 * above), determine the least number of metronomes needed to play the rhythm
 * on a loop.
 */
function findLeastNumberOfMetronomesNeededToPlayRhythmOnLoop(notes) {
    let noteListWithZerosForSolvedNotes = [...notes] // make a copy of the input that we can make changes to as we go
    let solution = [...notes].fill(0) // start the solution off as a list of all 0s, which we will fill in with metronomes as we find them.
    let metronomeCount = 0; // keep track of how many metronomes we have needed as we go

    /**
     * First check the smallest possible metronome interval, which is 1, and move upwards from there, trying larger and 
     * larger intervals. Smaller intervals mean fewer metronomes will be needed in the end, so we want to try those first.
     * Also, only try intervals that divide evenly into the length of the list of notes, since we want to be able to 
     * run the metronomes on a loop.
     */
    for (let interval = 1; interval < notes.length + 1; interval++) {
        if (notes.length % interval !== 0) {
            /**
             * To play on a loop, we need the metronome to start over at the beginning of the rhythm,
             * so it should divide into the loop evenly! Therefore skip any interval that doesn't
             * divide into the loop evenly.
             */
            continue; 
        }

        /**
         * For each interval we try, first start it on beat 1, then on beat 2 ,and keep working your way forward.
         * Stop checking once there are no beats left, or once the beat to start on is larger than the interval, since
         * that would mean we are checking a metronome we have already checked, its interval has just repeated.
         */
        for (let startOnBeat = 1; startOnBeat < notes.length + 1; startOnBeat++) {
            if (startOnBeat > interval) {
                /**
                 * Stop checking if the beat to start on is larger than the interval, since 
                 * that means we've already checked this metronome on a previous beat.
                 */
                break;
            }

            let metronomeWorks = checkWhetherMetronomeWorks(noteListWithZerosForSolvedNotes, startOnBeat, interval);

            if (metronomeWorks) {
                metronomeCount++;
                console.log("found a metronome that works! it starts on beat " + startOnBeat + ", and has an interval of " + interval + ". metronomes used so far: " + metronomeCount) + ".";

                // mark the notes we found a metronome for as solved by replacing them with 0s in the list, so that we won't try to check them again
                noteListWithZerosForSolvedNotes = setNewValueForMetronomeNotes(noteListWithZerosForSolvedNotes, 0, startOnBeat, interval)
                // also mark the notes we found a metronome for with their metronome number in the solution!
                solution = setNewValueForMetronomeNotes(solution, metronomeCount, startOnBeat, interval)
            }
        }
    }

    /**
     * We always expect to find a solution, since in the worst 
     * case, every note could have its own metronome.
     * So print and return info about the solution.
     */
    console.log("solved using " + metronomeCount + " metronomes. solution: ")
    console.log(solution)

    return metronomeCount
}

/**
 * Check whether a metronome with the specified starting beat and interval works or not.
 * 'startingBeat' is what beat the metrnome starts on (beat 1, beat 2, beat 3, etc.), and
 * 'interval' is what interval the metronome ticks at (every 1 beat, every 2 beats, etc.)
 */
function checkWhetherMetronomeWorks(notes, startingBeat, interval) {
    if (startingBeat > interval) {
        throw "this check isn't valid, since the starting beat is larger than the metronome interval! starting beat was: " + startingBeat + ". interval was: " + interval + "."
    }

    if (interval <= 0) {
        return false
    }

    // beat values start at 1 rather than 0, so subtract 1 from 'startingBeat' before iterating.
    for (let i = startingBeat - 1; i < notes.length; i += interval) {
        if (notes[i] === 0) {
            return false; // this metronome lands on a rest, so it won't work
        }
    }
    return true;
}

/**
 * Given a list of notes, and metronome settings, replace every note that falls on the given
 * metronome with the given value. For example, with an interval of 4, a starting beat of 1,
 * and a new value of 9, every 4th note will be replaced with a 9. 
 * Return the resulting list.
 */
function setNewValueForMetronomeNotes(notes, newValue, startingBeat, interval) {
    if (startingBeat > interval) {
        throw "this operation isn't valid, since the starting beat is larger than the metronome interval! starting beat was: " + startingBeat + ". interval was: " + interval + "."
    }

    if (interval <= 0) {
        throw "given interval was less than or equal to 0, which is not supported. interval was: " + interval + "."
    }

    // beat values start at 1 rather than 0, so subtract 1 from 'startingBeat' before iterating.
    for (let i = startingBeat - 1; i < notes.length; i += interval) {
        notes[i] = newValue
    }
    return notes
}

// Basic 'assert equals' method, which throws the given message if the two given values arent equal (===) to each other.
function assertEquals(expected, actual, message) {
    if (expected !== actual){
        throw "assertion failed: '" + message + "'. expected: '" + expected + "'; actual '" + actual + "'"
    }
}

// a few basic unit tests just used for debugging
assertEquals(true, checkWhetherMetronomeWorks([1,0,0,0,1], 1, 4), "test 'checkWhetherMetronomeWorks' for a basic working metronome")
assertEquals(true, checkWhetherMetronomeWorks([1,0,1,0,1], 1, 4), "test 'checkWhetherMetronomeWorks' for another basic working metronome")
assertEquals(true, checkWhetherMetronomeWorks([1,0,1,0,1], 1, 2), "test 'checkWhetherMetronomeWorks' for a basic working metronome with a smaller interval")
assertEquals(false, checkWhetherMetronomeWorks([1,0,1,0,0], 1, 2), "test 'checkWhetherMetronomeWorks' for a non-working metronome")
assertEquals(false, checkWhetherMetronomeWorks([0,0,1,0,1], 1, 2), "test 'checkWhetherMetronomeWorks' for a metronome that starts on a rest")

/**
 * Run the actual code to solve the problem
 */
findLeastNumberOfMetronomesNeededToPlayRhythmOnLoop(notes)