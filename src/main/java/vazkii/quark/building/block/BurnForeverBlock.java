package vazkii.quark.building.block;

import net.minecraft.block.BlockState;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.Direction;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.IWorldReader;
import vazkii.quark.base.block.QuarkBlock;
import vazkii.quark.base.module.Module;
import vazkii.quark.building.module.CompressedBlocksModule;

public class BurnForeverBlock extends QuarkBlock {

	public BurnForeverBlock(String regname, Module module, ItemGroup creativeTab, Properties properties) {
		super(regname, module, creativeTab, properties);
	}

	@Override
	public boolean isFireSource(BlockState state, IWorldReader world, BlockPos pos, Direction side) {
		return side == Direction.UP && CompressedBlocksModule.burnsForever;
	}
	
}
