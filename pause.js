/**
 * @author: Simon Ernst
 * @github: https://github.com/netmute/impact-pause
 * */
ig.module(
  'plugins.gui.pause'
)
.requires(
  'impact.game',
  'impact.timer'
)
.defines(function () {
  ig.Game.inject({

    paused: false,
    pauseDelayTimer: new ig.Timer(),
    pauseButtonDelay: .2,

    updateEntities: function () {
      for (var i = 0; ent = this.entities[i]; i++) {
        if (!ent._killed && !this.paused) {
          ent.update();
        } else if (ent.ignorePause) {
          ent.update();
        }
      }
    },

    togglePause: function (override) {
      if (this.pauseDelayTimer.delta() > this.pauseButtonDelay) {
        this.paused = override != null ? override : !this.paused;
        if (!this.paused) {
          this.onResume();
        } else {
          this.onPause();
        }
        this.pauseDelayTimer.reset();
      }
    },

    onResume: function () { },
    onPause: function () { }
  });

  ig.Entity.inject({
    ignorePause: false
  });

});
