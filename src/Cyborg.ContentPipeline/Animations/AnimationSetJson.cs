using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Cyborg.ContentPipeline.Animation
{
    public class AnimationSetJson
    {
        [JsonPropertyName("frame_rate")]
        public int FrameRate { get; set; }
        [JsonPropertyName("frame_width")]
        public int FrameWidth { get; set; }
        [JsonPropertyName("frame_height")]
        public int FrameHeight { get; set; }
        public IEnumerable<AnimationJson> Animations { get; set; }

        public class AnimationJson
        {
            public string Key { get; set; }
            public int[][] Frames { get; set; }
        }
    }
}