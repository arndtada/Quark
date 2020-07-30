function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'add-spacing-for-stack': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.item.ItemStack',
                'methodName': 'func_151000_E', // getTextComponent
                'methodDesc': '()Lnet/minecraft/util/text/ITextComponent;'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.ARETURN, function (target) {
                    var newInstructions = new InsnList();
                    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "createStackComponent",
                        "(Lnet/minecraft/util/text/IFormattableTextComponent;Lnet/minecraft/item/ItemStack;)Lnet/minecraft/util/text/IFormattableTextComponent;",
                        ASM.MethodType.STATIC
                    ));
                    method.instructions.insertBefore(target, newInstructions);
                })
            }
        },
        'override-quad-color': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraftforge.client.model.pipeline.LightUtil',
                'methodName': 'renderQuadColor', // Forge Method
                'methodDesc': '(Lnet/minecraft/client/renderer/BufferBuilder;Lnet/minecraft/client/renderer/model/BakedQuad;I)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                var newInstructions = new InsnList();

                newInstructions.add(new VarInsnNode(Opcodes.ILOAD, 2));
                newInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "transformQuadRenderColor",
                    "(I)I",
                    ASM.MethodType.STATIC
                ));
                newInstructions.add(new VarInsnNode(Opcodes.ISTORE, 2));
                method.instructions.insertBefore(method.instructions.getFirst(), newInstructions);
                return method;
            }
        }
    }
}
