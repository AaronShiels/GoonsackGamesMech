using System;

namespace Cyborg.Sprites
{
    public struct AnimationDefinition
    {
        public AnimationDefinition(int frameWidth, int frameHeight, int rowIndex, int frameCount, int frameRate)
        {
            FrameWidth = frameWidth;
            FrameHeight = frameHeight;
            RowIndex = rowIndex;
            FrameCount = frameCount;
            FrameRate = frameRate;
        }

        public int FrameWidth { get; }
        public int FrameHeight { get; }
        public int RowIndex { get; }
        public int FrameCount { get; }
        public int FrameRate { get; }
        public float TotalDuration => (float)FrameCount / FrameRate;
        public float FrameDuration => 1f / FrameRate;

        public override bool Equals(object obj) => obj is AnimationDefinition definition
            && FrameWidth == definition.FrameWidth
            && FrameHeight == definition.FrameHeight
            && RowIndex == definition.RowIndex
            && FrameCount == definition.FrameCount
            && FrameRate == definition.FrameRate
            && TotalDuration == definition.TotalDuration
            && FrameDuration == definition.FrameDuration;

        public override int GetHashCode() => HashCode.Combine(FrameWidth, FrameHeight, RowIndex, FrameCount, FrameRate, TotalDuration, FrameDuration);
        public static bool operator ==(AnimationDefinition ad1, AnimationDefinition ad2) => ad1.Equals(ad2);
        public static bool operator !=(AnimationDefinition ad1, AnimationDefinition ad2) => !ad1.Equals(ad2);
    }
}