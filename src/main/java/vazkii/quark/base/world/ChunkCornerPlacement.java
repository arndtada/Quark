package vazkii.quark.base.world;

import java.util.Random;
import java.util.stream.Stream;

import com.google.common.collect.ImmutableSet;

import net.minecraft.util.math.BlockPos;
import net.minecraft.world.IWorld;
import net.minecraft.world.gen.ChunkGenerator;
import net.minecraft.world.gen.placement.NoPlacementConfig;
import net.minecraft.world.gen.placement.Placement;

public class ChunkCornerPlacement extends Placement<NoPlacementConfig> {

	public ChunkCornerPlacement() {
		super(NoPlacementConfig.field_236555_a_);
	}

	@Override
	public Stream<BlockPos> getPositions(IWorld worldIn, ChunkGenerator generatorIn, Random random, NoPlacementConfig configIn, BlockPos pos) {
		return ImmutableSet.of(pos).stream();
	}


}
